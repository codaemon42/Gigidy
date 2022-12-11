const console = require("../../../helpers/console");
const createError = require('http-errors');
const { Op } = require('sequelize');
const { GigWorkers, Ratings } = require("../model");
const Service = require("../Service");


class GigWorkerService extends Service {
	constructor() {
		super(GigWorkers);
		console(`${this.model.name} service started`);
	}

	async findByUserId(user_id){
		const gigWorker = await GigWorkers.findOne({
			where: {
				user_id
			}
		})
		return gigWorker;
	}

}

module.exports = new GigWorkerService();