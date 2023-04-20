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
    const spots = await Spot.findAll({ attributes: { exclude: 'UserId' } });

    const payload = [];

    for(let i = 0; i < spots.length; i++) {
        const spot = spots[i];

        const stars = await Review.findAll({ 
            where: {
                spotId: spot.id
            },
            attributes: ['stars']
        });

        const preview = await spot.getSpotImages({
            attributes: ['url', 'preview'],
        });

        let sum = 0;

        for (let i of stars) {
            sum += i.dataValues.stars;
        }

        let avgRating = (sum/stars.length).toFixed(1);

        let previewImage;

        if(preview[0].preview) {
            previewImage = preview[0].url;
        }
        else {
            previewImage = null;
        }

        const spotData = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating,
            previewImage
        }

        payload.push(spotData);
    }

    res.json(payload);
});

module.exports = router;