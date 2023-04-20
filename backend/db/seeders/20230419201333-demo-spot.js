'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '12345 N 1st Street',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 12.3456789,
        lng: -1.2345678,
        name: 'Place 1',
        description: 'It exists',
        price: 100.78
      },
      {
        ownerId: 1,
        address: '54321 S 9th Street',
        city: 'New York City',
        state: 'New York',
        country: 'United States',
        lat: -98.7654321,
        lng: 8.7654321,
        name: '9 Place',
        description: 'It exists but backwards',
        price: 870.01
      },
      {
        ownerId: 3,
        address: 'Isle O\' Hags',
        city: 'Spiral Mountain',
        country: 'Dream: Land Of Giants',
        lat: 54.9383471,
        lng: 0.0000000,
        name: 'Banjo and Kazooie\'s House',
        description: 'The home of Banjo and Kazooie as depicted in almost every game',
        price: 999.99
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Place 1', '9 Place', 'Banjo and Kazooie\'s House'] }
    }, {});
  }
};
