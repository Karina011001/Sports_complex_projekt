const { Sequelize } = require("sequelize");
require("colors");
require('dotenv').config()


const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER,
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  schema: process.env.DB_SCHEMA,
  pool:
  {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})


const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`DB Connected`.blue.underline.bold);
  } catch (error) {
    console.error("Unable to connect to the database:".red.bold, error);
  }
};

checkConnection();

module.exports = sequelize;