const { USERTYPE } = require("../../../config/constans");
const Validator = require("../Validator");


class UserValidator extends Validator {

	searchDto(data) {
		return this.joi.object({
			firstName: this.joi.string().optional(),
			lastName: this.joi.string().optional(),
			type: this.joi.string().optional(),
			email: this.joi.string().optional(),
			page: this.joi.number().optional()
		}).validate(data);
	}

	signUp(data) {
		return this.joi.object({
			firstName: this.joi.string().optional(),
			lastName: this.joi.string().optional(),
			authType: this.joi.string().required(),
			username: this.joi.string().required(),
			password: this.joi.string().required()
		}).validate(data);
	}

	login(data){
		return this.joi.object({
			username: this.joi.string().required(),
			password: this.joi.string().required()
		}).validate(data);
	}

	forgotPassword(data) {
		return this.joi.object({
			username: this.joi.string().required(),
			authType: this.joi.string().valid("email", "phone").required()
		}).validate(data);
	}

	resetPassword(data) {
		return this.joi.object({
			username: this.joi.string().required(),
			password: this.joi.string().required(),
			code: this.joi.string().required()
		}).validate(data);
	}

	verify(data) {
		return this.joi.object({
			username: this.joi.string().required(),
			code: this.joi.string().required()
		}).validate(data);
	}

	userType(data){
		return this.joi.object({
			username: this.joi.string().required(),
			userType: this.joi.string().valid(USERTYPE.GIG_WORKER, USERTYPE.BUSINESS).required()
		}).validate(data);
	}
}

module.exports = new UserValidator();