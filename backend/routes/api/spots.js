const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const sequelize = require('sequelize');

const { requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const verifySpot = async (req, _res, next) => {
    const spots = await Spot.findAll();

    const spot = spots.find(spot => spot.id == req.params.id);

    if (!spot) {
        const err = new Error("Couldn't find a Spot with the specified id");
        err.title = "Resource Not Found";
        err.errors = { message: "Spot couldn't be found."};
        err.status = 404;
        return next(err);
    }

    next();
}

const validateSpotBody = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .withMessage('Longitude is not valid'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReviewBody = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const { Op } = require('sequelize');
const { verify } = require('jsonwebtoken');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({ where: { ownerId: req.user.id } });

    const spotsFinal = [];

    for(let i = 0; i < spots.length; i++) {
        const spot = spots[i];

        const stars = await Review.findAll({ 
            where: {
                spotId: spot.id
            },
            attributes: ['stars']
        });

        const spotImage = await SpotImage.findOne({
            where: {
                spotId: spot.id
            },
            attributes: ['url', 'preview']
        });

        let sum = 0;

        for (let i of stars) {
            sum += i.dataValues.stars;
        }
        
        let avgRating

        if (stars[0]) {
            avgRating = (sum/stars.length).toFixed(1);
        }
        else {
            avgRating = null
        }

        let previewImage;

        if(spotImage) {
            if(spotImage.preview) {
                previewImage = spotImage.url;
            }
            else {
                previewImage = null;
            }
        }
        else {
            previewImage = null;
        }

        const spotBody = {
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

        spotsFinal.push(spotBody);
    }

    const final = {
        "Spots": spotsFinal
    }

    res.json(final);
});

router.get('/:id', verifySpot, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    const stars = await Review.findAll({ 
        where: {
            spotId: spot.id
        },
        attributes: ['stars']
    });

    const SpotImages = await SpotImage.findAll({
        where: {
            spotId: spot.id
        },
        attributes: ['id', 'url', 'preview']
    });

    const Owner = await User.findByPk(spot.ownerId, { attributes : ['id', 'firstName', 'lastName'] })

    let sum = 0;
    for (let i of stars) {
        sum += i.dataValues.stars;
    }
    
    let avgStarRating;

    if (stars[0]) {
        avgStarRating = (sum/stars.length).toFixed(1);
    }
    else {
        avgStarRating = null
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
        numReviews: stars.length,
        avgStarRating,
        SpotImages,
        Owner
    }

    res.json(spotData);
});

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();

    const spotFinal = [];

    for(let i = 0; i < spots.length; i++) {
        const spot = spots[i];

        const stars = await Review.findAll({ 
            where: {
                spotId: spot.id
            },
            attributes: ['stars']
        });

        const spotImage = await SpotImage.findOne({
            where: {
                spotId: spot.id
            },
            attributes: ['url', 'preview']
        });

        let sum = 0;

        for (let i of stars) {
            sum += i.dataValues.stars;
        }
        
        let avgRating

        if (stars[0]) {
            avgRating = (sum/stars.length).toFixed(1);
        }
        else {
            avgRating = null
        }

        let previewImage;

        if(spotImage) {
            if(spotImage.preview) {
                previewImage = spotImage.url;
            }
            else {
                previewImage = null;
            }
        }
        else {
            previewImage = null;
        }

        const spotBody = {
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

        spotFinal.push(spotBody);
    }

    const final = {
        "Spots": spotFinal
    }

    res.json(final);
});

router.get('/:id/reviews', verifySpot, async (req, res) => {
    const reviews = await Review.findAll({ where: { spotId: req.params.id } });

    const reviewFinal = [];

    for (let r of reviews) {
        const user = await User.findByPk(r.userId);

        const ReviewImages = await ReviewImage.findAll({ where: { reviewId: r.id } });

        const reviewBody = {
            id: r.id,
            userId: r.userId,
            spotId: r.spotId,
            review: r.review,
            stars: r.stars,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            User: user,
            ReviewImages
        }

        reviewFinal.push(reviewBody);
    }

    const final = {
        Reviews: reviewFinal
    }

    res.json(final);
});

router.get('/:id/bookings', requireAuth, verifySpot, async (req, res) => {
    const bookings = await Booking.findAll({ where: { spotId: req.params.id } });

    let bookingFinal = [];

    for(let b of bookings) {
        const user = await User.findByPk(req.user.id);

        const bookingBody = {
            User: user,
            id: b.id,
            spotId: b.spotId,
            userId: b.userId,
            startDate: b.startDate,
            endDate: b.endDate,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt
        }

        bookingFinal.push(bookingBody);
    }

    const final = {
        Bookings: bookingFinal
    };

    res.json(final);
});

router.post('/:id/images', requireAuth, verifySpot, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);    

    if (spot.ownerId == req.user.id) {
        const { url, preview } = req.body;

        const spotImage = await SpotImage.create({ spotId: req.params.id, url, preview });

        const final = {
            id: spotImage.id,
            url: spotImage.url,
            preview: spotImage.preview
        }

        res.json(final);
    }
});

router.post('/', requireAuth, validateSpotBody, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.create({ ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price });

    const final = {
        id: spot.id,
        ownerId: req.user.id,
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
        updatedAt: spot.updatedAt
    };

    res.json(final)
});

router.post('/:id/reviews', requireAuth, verifySpot, validateReviewBody, async(req, res, next) => {
    const checkReviews = await Review.findAll({ where: { userId: req.user.id, spotId: req.params.id } });

    if(checkReviews[0]) {
        const err = new Error("Review from the current user already exists for the Spot");
        err.title = "Review from user already exists for the Spot";
        err.errors = { message: "User already has a review for this spot"};
        err.status = 500;
        return next(err);
    }
    
    const { review, stars } = req.body;

    const newReview = await Review.create({ userId: req.user.id, spotId: req.params.id, review, stars });

    const final = {
        id: newReview.id,
        userId: newReview.userId,
        spotId: newReview.spotId,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt
    }

    res.json(final);
});

router.post('/:id/bookings', requireAuth, verifySpot, async (req, res, next) => {
    const endDatePlus = new Date((req.body.endDate).toDateString());
    const startDatePlus = new Date((req.body.startDate).toDateString());

    if (endDatePlus.getTime() >= startDatePlus.getTime()) {
        const err = Error("Bad request.");
        err.errors = { "endDate": "endDate cannot be on or before startDate"};
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }

    const bookings = await Booking.findAll({ where: { spotId: req.params.id } });

    for (let b in bookings) {
        const bEndDate = new Date((b.endDate).toDateString());
        const bStartDate = new Date((b.startDate).toDateString());

        const errors = {};

        if ((startDatePlus >= bStartDate) && (startDatePlus <= bEndDate)) {
            errors.startDate = "Start date conflicts with an existing booking";
        }
        
        if ((endDatePlus >= bStartDate) && (endDatePlus <= bEndDate)) {
            errors.endDate = "End date conflicts with an existing booking";
        }

        const err = Error("Sorry, this spot is already booked for the specific dates");
        err.errors = errors;
        err.status = 403;
        err.title = "Booking Conflict";
        return next(err);
    }

    const spot = await Spot.findByPk(req.params.id);

    if (spot.ownerId != req.user.id) {
        const { startDate, endDate } = req.body;

        const newBooking = await Booking.create({ spotId: req.params.id, userId: req.user.id, startDate, endDate });

        const final = {
            id: newBooking.id,
            spotId: newBooking.spotId,
            userId: newBooking.userId,
            startDate: newBooking.startDate,
            endDate: newBooking.endDate,
            createdAt: newBooking.createdAt,
            updatedAt: newBooking.updatedAt
        }

        res.json(final);
    }
});

router.put('/:id', requireAuth, verifySpot, validateSpotBody, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);    

    if (spot.ownerId == req.user.id) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const values = { address, city, state, country, lat, lng, name, description, price, updatedAt: new Date() };

        await spot.update(values);

        await spot.save();

        const final = {
            id: spot.id,
            ownerId: req.user.id,
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
            updatedAt: spot.updatedAt
        };
    
        res.json(final)
    }
});

router.delete('/:id', requireAuth, verifySpot, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);    

    if (spot.ownerId == req.user.id) {
        await spot.destroy();

        res.json({ message: "Successfully deleted" });
    }
});

module.exports = router;