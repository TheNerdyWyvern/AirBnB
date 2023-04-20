'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://cdn.yep.com/en/assets/static/media/logo-light.b24bd7f574d770d73c99080ca0cfaf2d.svg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://s.yimg.com/rz/p/yahoo_homepage_en-US_s_f_p_bestfit_homepage_2x.png',
        preview: true
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};

