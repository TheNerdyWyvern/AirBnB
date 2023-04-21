const express = require('express');
const { check } = require('express-validator');

const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const verifyBooking = async (req, _res, next) => {
    const bookings = await Booking.findAll();

    const booking = bookings.find(booking => booking.id == req.params.id);

    if (!booking) {
        const err = new Error("Couldn't find a Booking with the specified id");
        err.title = "Resource Not Found";
        err.errors = { message: "Booking couldn't be found."};
        err.status = 404;
        return next(err);
    }

    next();
}

const validateReviewBody = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const bookings = await Booking.findAll({ where: { userId: req.user.id } });

    const spot = await Spot.findByPk(bookings.spotId);

    let bookingsFinal = [];

    for (let b of bookings) {
        const spot = await Spot.findByPk(b.spotId);

        const bookingsBody = {
            id: b.id,
            spotId: b.spotId,
            Spot: spot,
            userId: req.user.id,
            startDate: b.startDate,
            endDate: b.endDate,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt
        }

        bookingsFinal.push(bookingsBody);
    }

    const final = {
        Bookings: bookingsFinal
    };
    
    res.json(final);
});

module.exports = router;