const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/postgres.db");

const User = sequelize.define('users',{
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true
	},
	firstName: {
		type: DataTypes.STRING
	},
	lastName: {
		type: DataTypes.STRING
	},
	username: {
		type: DataTypes.STRING
	},
	email: {
		type: DataTypes.STRING,
		validate: {
			isEmail: true
		}
	},
	phone: {
		type: DataTypes.STRING
	},
	password: {
		type: DataTypes.STRING,
	},
	active: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	verified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	type: {
		type: DataTypes.STRING
	},
	roleId: {
		type: DataTypes.INTEGER,
		defaultValue: 2
	},
	resetCode: {
		type: DataTypes.STRING
	},
	resetExpiresIn: {
		type: DataTypes.DATE
	}
});

module.exports = User;