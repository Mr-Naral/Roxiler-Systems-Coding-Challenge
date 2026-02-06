const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false, validate: { len: [20, 60] } },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, validate: { len: [0, 400] } },
    role: { type: DataTypes.ENUM('admin', 'user', 'owner'), defaultValue: 'user' }
});


const Store = sequelize.define('Store', {
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false }
});


const Rating = sequelize.define('Rating', {
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
});


User.hasMany(Store, { foreignKey: 'ownerId' });
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

User.hasMany(Rating);
Rating.belongsTo(User);

Store.hasMany(Rating);
Rating.belongsTo(Store);

module.exports = { User, Store, Rating };