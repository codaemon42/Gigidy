const { Sequelize } = require('sequelize');

const database = process.env.DATABASE;
const databaseProd = process.env.DATABASE_prod;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

let sequelize;

if(process.env.platform === "local"){
	// local db usage
	sequelize = new Sequelize(database, username, password, {
		host: 'localhost',
		dialect: 'postgres',
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		}
	});
}
else if(platform.env.platform === "dev"){
	// local node server to gcp db
	const sequelize = new Sequelize(process.env.POSTGRESQL_URL)
}
else if(platform.env.platform === "production"){
	// for gcp deploy
	const INSTANCE_CONNECTION_NAME = process.env.INSTANCE_CONNECTION_NAME;
	sequelize = new Sequelize(databaseProd, username, password, {
		dialect: 'postgres',
		// e.g. host: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
		host: `/cloudsql/${INSTANCE_CONNECTION_NAME}`,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		dialectOptions: {
			// e.g. socketPath: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
			// same as host string above
			socketPath: `/cloudsql/${INSTANCE_CONNECTION_NAME}`
		},
		logging: false,
		operatorsAliases: 0
	});
}

module.exports = sequelize;