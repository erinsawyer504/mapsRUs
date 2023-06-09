const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class City extends Model {}


City.init (
{
    id: {
        type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    name: {
        type: DataTypes.STRING,
        allowNull: false
}

}, 
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'city',
});

// Sync the model with the database


module.exports = City;