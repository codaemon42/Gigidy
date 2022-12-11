const console = require("../../../helpers/console");
const createError = require('http-errors');
const { Op } = require('sequelize');
const { User, UserRole } = require("../model");
const Service = require("../Service");


class UsersService extends Service {
	constructor() {
		super(User);
		console(`${this.model.name} service started`);
	}

	async getUsers(data=null) {
		try{
			const page = +data.page || 1;
			delete data.page;
			const limit = 5;
			const offset = limit*(page-1);
			const where = {};
			if(data.type) where.type = data.type;
			if(data.firstName) where.firstName = {[Op.iLike]: `${data.firstName}%`};
			if(data.lastName) where.lastName = {[Op.iLike]: `${data.lastName}%`};
			if(data.email) where.email = {[Op.iLike]: `${data.email}%`};
			return await this.model.findAndCountAll({
				where: {...where},
				include: [
						{
							model: UserRole,
							required: false,
							attributes: {exclude: ['createdAt', 'updatedAt']},
						},
					],
					attributes: {exclude: ['password', 'roleId']},
					offset,
					limit,
					order: [['createdAt', 'DESC']]
			});
		}catch(err){
			console(err, 'user service')
			return createError(500);
		}
	}

	async getUsersByEmail(email) {
		try{
			return await this.model.findAndCountAll({
				where: {
					email: {[Op.iLike] : `${email}%`}
				},
				attributes: {exclude: ['password', 'roleId']},
				order: [['createdAt', 'DESC']]
			});
		}catch(err){
			console(err)
			return createError(500);
		}
	}

	async checkUser(username, email){
		return await this.model.findOne({
			where: {
				[Op.or]: [{username}, {email}]
			},
			include: [
				{
					model: UserRole,
					required: false,
					attributes: {exclude: ['createdAt', 'updatedAt']},
				}
			],
		});
	}

	async checkUserByEmailOrPhone(username){
		return await this.model.findOne({
			where: {
				[Op.or]: [{email: username}, {phone: username}, {username}]
			},
			include: [
				{
					model: UserRole,
					required: false,
					attributes: {exclude: ['createdAt', 'updatedAt']},
				}
			],
		});
	}

	async findByUsername(username, email){
		return await this.model.findOne({
			where: {
				[Op.or]: [{username}, {email}]
			},
			attributes: {exclude: ['createdAt', 'updatedAt', 'password', 'roleId']},
		});
	}


	async verify(id) {
		return await this.update(id, {verified: true, resetCode: null, resetExpiresIn: null});
	}

}

module.exports = new UsersService();