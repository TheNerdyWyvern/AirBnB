const express = require('express');
const { check } = require('express-validator');

const { requireAuth } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');
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

router.put('/:id', requireAuth, verifyBooking, async (req, res, next) => {
    const newEndDate = new Date(req.body.endDate);
    const newStartDate = new Date(req.body.startDate);

    const endDatePlus = new Date(newEndDate.toDateString());
    const startDatePlus = new Date(newStartDate.toDateString());

    if (endDatePlus.getTime() <= startDatePlus.getTime()) {
        const err = Error("Bad request.");
        err.errors = { "endDate": "endDate cannot be on or before startDate"};
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }

    const booking = await Booking.findByPk(req.params.id)

    const newBEndDate = new Date(booking.endDate);
    const newBStartDate = new Date(booking.startDate);

    const bEndDate = new Date(newBEndDate.toDateString());
    const bStartDate = new Date(newBStartDate.toDateString());

    const errors = {};

    if ((startDatePlus.getTime() >= bStartDate.getTime()) && (startDatePlus.getTime() <= bEndDate.getTime())) {
        errors.startDate = "Start date conflicts with an existing booking";
    }
    if ((endDatePlus.getTime() >= bStartDate.getTime()) && (endDatePlus.getTime() <= bEndDate.getTime())) {
        errors.endDate = "End date conflicts with an existing booking";
    }

    if(errors.startDate || errors.endDate) {
        const err = Error("Sorry, this spot is already booked for the specific dates");
        err.errors = errors;
        err.status = 403;
        err.title = "Booking Conflict";
        return next(err);
    }

    const currentCheck = new Date().toDateString();

    if (currentCheck.getTime() >= bEndDate.getTime()) {
        const err = Error("Can't edit a booking that's past the end date");
        err.errors = { message: "Past bookings can't be modified"};
        err.status = 403;
        err.title = "Past bookings can't be modified";
        return next(err);
    }

    if(booking.userId == req.user.id) {
        const { startDate, endDate } = req.body;

        const values = { startDate, endDate, updatedAt: new Date() };

        await booking.update(values);

        await booking.save();

        const final = {
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startdDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }

        res.json(final);
    }
    else {
        const err = Error("Forbidden");
        err.errors = { message: "Forbidden"};
        err.status = 403;
        err.title = "Forbidden";
        return next(err);
    }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.id);

    bookingStartDateCheck = new Date(booking.startDate);

    const bookingCheck = new Date(bookingStartDateCheck.toDateString());
    const currentCheck = new Date().toDateString();

    if (currentCheck >= bookingCheck) {
        const err = Error("Bookings that have been started can't be deleted");
        err.errors = { message: "Bookings that have been started can't be deleted"};
        err.status = 403;
        err.title = "Bookings that have been started can't be deleted";
        return next(err);
    }

    if (booking.userId == req.user.id) {
        await booking.destroy();

        res.json({ message: 'Successfully deleted' });
    }
    else {
        const err = Error("Forbidden");
        err.errors = { message: "Forbidden"};
        err.status = 403;
        err.title = "Forbidden";
        return next(err);
    }
});

module.exports = router;