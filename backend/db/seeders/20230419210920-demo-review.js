'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 2,
        spotId: 1,
        review: 'Its not backwards so I dont like it',
        stars: 2
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Not silly enough but it was still very nice',
        stars: 4
      },

      {
        userId: 2,
        spotId: 2,
        review: 'Absolutely perfect 5 stars',
        stars: 4
      },
      {
        userId: 3,
        spotId: 2,
        review: 'bing bong',
        stars: 3
      },

      {
        userId: 1,
        spotId: 3,
        review: 'I loved the banjo games',
        stars: 5
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Kinda sucked, was attacked by some witch or something trying to steal the puzzle pieces I was working on in my free time',
        stars: 5
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
