const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const sequelize = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        attributes: {
            exclude: 'UserId',
            include: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'], 'Review']
        },
        include: [
            // {
            //     model: Review,
            //     attributes: [sequelize.fn('AVG', sequelize.col('stars')), 'Review']
            // },
            {
                model: SpotImage,
                attributes: ['url']
            }
        ]
    });

    res.json(spots);
});

module.exports = router;