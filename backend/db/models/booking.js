'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot);
      Booking.belongsTo(models.User);
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8,10]
      }
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8,10]
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};