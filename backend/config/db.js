const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); 
        console.log('Database Connection Successful');
    } catch (err) {
        console.error('DB Connection Error:', err);
    }
};

module.exports = { sequelize, connectDB };