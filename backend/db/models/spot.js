'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(models.Review);
      Spot.hasMany(models.SpotImage);
      Spot.hasOne(models.Booking);
      Spot.belongsTo(models.User);
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: DataTypes.STRING,
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        len: [3,12],
        hasCents(val) {
          if (val.toString().split('.')[2].length !== 2) {
            throw new Error("Must add cents");
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};