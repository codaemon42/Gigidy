const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/postgres.db");

const Ratings = sequelize.define('ratings',{
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true
	},
	business_id: {
		type: DataTypes.BIGINT
	},
	gig_worker_id: {
		type: DataTypes.BIGINT
	},
	raitng: {
		type: DataTypes.STRING
	},
	review: {
		type: DataTypes.TEXT
	}
});

module.exports = Ratings;