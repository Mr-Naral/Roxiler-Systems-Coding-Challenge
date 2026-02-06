const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Store = sequelize.define('Store', {
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false }
});


Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' }); 

module.exports = Store;