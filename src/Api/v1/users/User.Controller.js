const { console, prepare, isValid, createUniqueId, resetDateExpiresIn, isResetCodeValid } = require('../../../helpers');
const { jwtOptions } = require('../../../config/auth');
const { hashSync, compareSync, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const {sendEmail, verificationTemplate, resetTemplate} = require('../../../config/email');
const UserValidator = require('./User.Validator');
const UsersService = require('./User.Service');
const Controller = require('../Controller');
const UserService = require('./User.Service');
const { SignUpReq } = require('./User.types');
const resetCodeExpiresIn = require('../../../helpers/resetCodeExpiresIn');
const { USER_ALREADY_REGISTERED, BAD_REQUEST, UPDATE_FAILED, USER_VERIFICATION_SUCCEED, USERNAME_REQUIRED, INVALID_RESET_CODE, USER_NOT_EXISTS, USER_NOT_VERIFIED, INVALID_CREDENTIAL, PERMISSION_DENIED } = require('../../../config/error.message');
const resetCodeValidity = require('../../../helpers/resetCodeValidity');
const crypto = require('crypto');


class UsersController extends Controller {
	constructor() {
		super(UserValidator, UsersService)
		console('users controller created');
	}

	/**
	 * Check User exists
	 * @req BODY{ username }
	 */
	async userExists(req, res, next){
		const { username } = req.body;
		if(!username) return res.status(400).json(prepare(false, "Please provide email or phone number", false));
		const userExists = await UsersService.checkUserByEmailOrPhone(username);
		return userExists ? res.status(200).json(prepare(true)) : res.status(404).json(prepare(false, USER_NOT_EXISTS, false));
	}

	/**
	 * Sign Up Users
	 * @req BODY{ firstName, lastName, authType, username, password }
	 */
	async signUp(req, res, next) {
		try{
			//* validation & verification
			const userData = new SignUpReq(req.body);
			const validation = UserValidator.signUp(userData);
			const validationHandler = isValid(validation);
			if(!validationHandler.valid) return next(validationHandler.error);

			//* process

			//* check username and email for existing user
			const userExists = await UsersService.checkUserByEmailOrPhone(userData.username);
			console(userExists)
			if(userExists){
				return res.status(400).json(prepare(false, USER_ALREADY_REGISTERED, false));
			}
			else {
				//* hashing password and create user
				userData.resetCode = createUniqueId();
				userData.resetExpiresIn = resetCodeExpiresIn();
				userData.password = hashSync(userData.password, +process.env.BCRYPT_SALT);
				userData.verified = false;
				userData.roleId = 4; // User role
				if(userData.authType === "email") userData.email = userData.username;
				if(userData.authType === "phone") userData.phone = userData.phone;

				const user = await UsersService.create(userData);
				user.resetCode = null;
				user.password = null;

				// send resetCode
				if(userData.authType === "email"){
					// const emailData = verificationTemplate(user.username, resetCode);
					// sendEmail(emailData.from, user.email, emailData.subject, emailData.body);
				} else if(userData.authType === "phone"){
					// send sms
				}
				
				//* handle error & send response
				return res.status(201).json(prepare(user));
			}
		}catch(err){
			console(err, "err")
			return next(createError(500));
		}
	}

	/**
	 * login User
	 * @req BODY{ username, password }
	 */
	async login( req, res, next ) {
		try{
			// validation & verification
			const userData = req.body;
			
			const validation = UserValidator.login(userData);
			const validationHandler = isValid(validation);
			if(!validationHandler.valid) return next(validationHandler.error);

			const user = await UsersService.checkUserByEmailOrPhone(userData.username, userData.username);
			if(!user){
				return res.status(404).json(prepare(false, USER_NOT_EXISTS, false));
			} else {
				// verify
				if(!user.verified) return res.status(403).json(prepare(false, USER_NOT_VERIFIED, false));

				const matched = compareSync(userData.password, user.password);
				if(!matched) return res.status(401).json(prepare(false, INVALID_CREDENTIAL, false));

				// jwt token {id: user.id, username: user.username, role: user.roleId}
				const token = jwt.sign( jwtOptions(user.id, user.username, user.roleId), process.env.JWT_SECRET);

				// sanitaize fields
				user.password = null;
				user.resetCode = null;
				user.resetExpiresIn = null;

				// handle error & send response
				return res.json(prepare({user, token}));
			}
		}catch(err){
			console(err.message);
			return next(createError(500));
		}
	}

	/**
	 * * Verify customer by token params
	 * ? Model User.verified = true
	 * @req BODY{ username, code }
	 * @returns {..., result: boolean}
	 */
	async verifyUser(req, res, next) {
		try{
			const { code, username } = req.body;

			const validation = UserValidator.verify(req.body);
			const validationHandler = isValid(validation);
			if(!validationHandler.valid) return next(validationHandler.error);

			const user = await UsersService.checkUserByEmailOrPhone(username, username);

			const validCode = resetCodeValidity(code, user.resetCode, user.resetCodeExpiresIn);
			if(!validCode.valid) return res.status(419).json(prepare(false, validCode.message, false));

			const result = await UserService.verify(user.id);

			return result instanceof Error ? res.status(500).json(prepare({}, UPDATE_FAILED, false)) : res.status(200).json(prepare(true, USER_VERIFICATION_SUCCEED));

		} catch(err){
			console(err.message);
			return next(createError(500));
		}
	}

	/**
	 * set userType
	 * @req BODY{ username, userType }
	 * @returns {... , result: boolean}
	 */
		 async setUserType(req, res, next) {
			try{
				const {username, userType} = req.body;
				const validation = UserValidator.userType(req.body);
				const validationHandler = isValid(validation);
				if(!validationHandler.valid) return next(validationHandler.error);
	
				const user = await UsersService.checkUserByEmailOrPhone(username, username);

				if(!user) return res.status(404).json(prepare(false, USER_NOT_EXISTS, false));

				if(!user.verified) return res.status(403).json(prepare(false, USER_NOT_VERIFIED, false));

				if(user.type) return res.status(403).json(prepare(false, PERMISSION_DENIED, false));

				await UserService.update(user.id, { type: userType});
	
				return res.status(200).json(prepare(true));
			} catch(err){
				console(err.message);
				return next(createError(500));
			}
		}

	/**
	 * User password forgot api
	 * @req BODY{ username, authType }
	 */
	async forgotPassword(req, res, next) {
		try{
			const { username, authType } = req.body;
			const validation = UserValidator.forgotPassword(req.body);
			const validationHandler = isValid(validation);
			if(!validationHandler.valid) return next(validationHandler.error);

			const userExists = await UsersService.checkUserByEmailOrPhone(username, username);
			if(!userExists){
				return res.status(404).json(prepare(false, USER_NOT_EXISTS, false));
			}
			else {
				// verify
				if(!userExists.verified) return res.status(403).json(prepare(false, USER_NOT_VERIFIED, false));

				const resetCode = createUniqueId();
				const resetExpiresIn = resetDateExpiresIn();
				const user = await UsersService.update(userExists.id, {resetCode, resetExpiresIn});
				user.resetCode = null;
				user.resetExpiresIn = null;
				user.password = null;

				// send resetCode
				if(authType === "email"){
					// const emailData = resetTemplate(userExists.username, resetCode);
					// sendEmail(emailData.from, user.email, emailData.subject, emailData.body);
				} else if(userData.authType === "phone"){
					// send sms
				}

				//* handle error & send response
				return res.status(200).json(prepare(user));
			}

		} catch(err){
			console(err.message);
			return next(createError(500));
		}
	}

	/**
	 * reset code verification
	 * @req BODY{ username, code }
	 * @returns {... , result: boolean}
	 */
	async verifyResetCode(req, res, next) {
		try{
			const {username, code} = req.body;

			const validation = UserValidator.verify(req.body);
			const validationHandler = isValid(validation);
			if(!validationHandler.valid) return next(validationHandler.error);

			const user = await UsersService.checkUserByEmailOrPhone(username, username);
			const isValidCode = isResetCodeValid(code, user.resetCode, user.resetExpiresIn);
			if(!isValidCode.valid) return res.status(403).json(prepare(false, isValidCode.message, false))

			return res.status(200).json(prepare(true, USER_VERIFICATION_SUCCEED));
		} catch(err){
			console(err.message);
			return next(createError(500));
		}
	}

	/**
	 * User password reset api
	 * @req BODY{ username, password }
	 */
	async resetPassword(req, res, next) {
		try{
			const userData = req.body;
			const validation = UserValidator.resetPassword(userData);
			const validationHandler = isValid(validation);
			if(!validationHandler.valid) return next(validationHandler.error);

			const userExists = await UsersService.checkUser(userData.username, userData.username);
			if(!userExists){
				return res.status(404).json(prepare(false, USER_NOT_EXISTS, false));
			}
			else {
				const isValidCode = isResetCodeValid(userData.code, userExists.resetCode, userExists.resetExpiresIn);
				if(!isValidCode.valid) return res.json(prepare(false, isValidCode.message, false))
				

				//* hashing password and create user
				userData.password = hashSync(userData.password, +process.env.BCRYPT_SALT );
				const user = await UsersService.update(userExists.id, {password: userData.password, resetCode: null, resetExpiresIn: null});
				user.password = null;

				//*  generating jwt token 
				const token = jwt.sign( jwtOptions(userExists.id, userExists.username, userExists.roleId), process.env.JWT_SECRET);
				

				//* handle error & send response
				return res.status(200).json(prepare({user, token}, isValidCode.message));
			}

		} catch(err){
			console(err.message);
			return next(createError(500));
		}
	}
}

module.exports = new UsersController();


// async fetch(req, res, next){
// 	try{
// 		const data = req.query;
// 		const validation = UserValidator.searchDto(data);
// 		const validationHandler = isValid(validation);
// 		if(!validationHandler.valid) return next(validationHandler.error);
// 		// process
// 		const result = await UsersService.getUsers(data);

// 		// handle error & send response
// 		return res.json(prepare(result));
// 	}catch(err){
// 		console(err.message)
// 		return next(createError(500));
// 	}
// }

// async fetchOne(req, res, next){
// 	try{
// 		// validation & verification
// 		const {id} = req.user;
// 		// process
// 		const result = await UsersService.findOne(id);
// 		result.password = null;

// 		// handle error & send response
// 		return res.json(prepare(result));

// 	}catch(err){
// 		console(err.message)
// 		return next(createError(500));
// 	}
// }

// async fetchOneByAdmin(req, res, next){
// 	try{
// 		// validation & verification
// 		const {id} = req.params;
// 		// process
// 		const result = await UsersService.findOne(id);
// 		result.password = null;

// 		// handle error & send response
// 		return res.json(prepare(result));

// 	}catch(err){
// 		console(err.message)
// 		return next(createError(500));
// 	}
// }

// async usersByEmail(req, res, next){
// 	try{
// 		// validation & verification
// 		const {email} = req.params;
// 		// process
// 		const result = await UsersService.getUsersByEmail(email);
// 		result.password = null;

// 		// handle error & send response
// 		return res.json(prepare(result));

// 	}catch(err){
// 		console(err.message)
// 		return next(createError(500));
// 	}
// }

// async addUser(req, res, next) {
// 	try{
// 		const userData = req.body;
		
// 		const userExists = await UsersService.checkUser(userData.username, userData.email);
// 		console(userExists)
// 		if(userExists){
// 			return res.status(400).json(prepare([], 'user already exists', false));
// 		}
// 		else {
// 			userData.password = hashSync(userData.password, +process.env.BCRYPT_SALT);
// 			const user = await UsersService.create(userData);

// 			return res.status(201).json(prepare(user, 'User created successfully'));
// 		}
// 	}catch(err){
// 		console(err.message)
// 		return next(createError(500));
// 	}
// }

// async updateUser(req, res, next) {
// 	try{
// 		//* validation & verification
// 		const userData = req.body;
// 		const id = userData.id;
// 		delete userData.id;

// 		// //* hashing password and create user
// 		if(userData.password) userData.password = hashSync(userData.password, +process.env.BCRYPT_SALT);
// 		const user = await UsersService.update(id, userData);


// 		//* handle error & send response
// 		return res.status(201).json(prepare(user, 'user updated successfully'));

// 	}catch(err){
// 		console(err.message)
// 		return next(createError(500));
// 	}
// }
