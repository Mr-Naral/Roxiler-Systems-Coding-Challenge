const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Store = require('./Store');

const Rating = sequelize.define('Rating', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    }
});


User.hasMany(Rating);
Store.hasMany(Rating);
Rating.belongsTo(User);
Rating.belongsTo(Store);

module.exports = Rating;