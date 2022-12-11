const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/postgres.db");

const UserRole = sequelize.define("userRole", {
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true
	},
	title: {
		type: DataTypes.STRING
	},
	description: {
		type: DataTypes.STRING
	},
	capabilities: {
		type: DataTypes.TEXT
	}
});

module.exports = UserRole;