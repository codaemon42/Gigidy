const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/postgres.db");

const GigWorkers = sequelize.define('gig_workers',{
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true
	},
	user_id: {
		type: DataTypes.BIGINT
	},
	first_name: {
		type: DataTypes.STRING
	},
	last_name: {
		type: DataTypes.STRING
	},
	address: {
		type: DataTypes.JSON
	},
	contact_number: {
		type: DataTypes.STRING
	},
	profile_picture: {
		type: DataTypes.STRING
	},
	work_rights: {
		type: DataTypes.TEXT
	},
	status: {
		type: DataTypes.STRING
	},
	verified: {
		type: DataTypes.BOOLEAN
	},
	gig_types: {
		type: DataTypes.JSON
	},
	available_time: {
		type: DataTypes.JSON
	},
	license: {
		type: DataTypes.JSON
	},
	venue_experience: {
		type: DataTypes.JSON
	},
	certification: {
		type: DataTypes.JSON
	},
	language: {
		type: DataTypes.JSON
	},
	last_login: {
		type: DataTypes.DATE
	}
});

module.exports = GigWorkers;