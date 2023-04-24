const express = require('express');
const { check } = require('express-validator');

const { requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, Spot, User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const verifyReview = async (req, _res, next) => {
    const reviews = await Review.findAll();

    const review = reviews.find(review => review.id == req.params.id);

    if (!review) {
        const err = new Error("Couldn't find a Review with the specified id");
        err.title = "Resource Not Found";
        err.errors = { message: "Review couldn't be found."};
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
    const reviews = await Review.findAll({ where: { userId: req.user.id } });

    const user = await User.findByPk(req.user.id);

    const spot = await Spot.findAll({ where: { ownerId: req.user.id } });

    let reviewFinal = [];

    for (let r of reviews) {
        const ReviewImages = await ReviewImage.findAll({ where: { reviewId: r.id } });

        const reviewBody = {
            id: r.id,
            userId: user.id,
            spotId: spot.id,
            review: r.review,
            stars: r.stars,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            User: user,
            Spot: spot[0],
            ReviewImages
        }

        reviewFinal.push(reviewBody);
    }

    const final = {
        Reviews: reviewFinal
    }

    res.json(final);
});

router.post('/:id/images', requireAuth, verifyReview, async (req, res, next) => {
    const images = await ReviewImage.findAll({ where: { reviewId: req.params.id } });

    if (images.length >= 10) {
        const err = new Error("Cannot add any more images because there is a maximum of 10 images per resource");
        err.title = "Resource has too many images";
        err.errors = { message: "Maximum number of images for this resource was reached" };
        err.status = 403;
        return next(err);
    }

    const review = await Review.findByPk(req.params.id);

    if (review.userId == req.user.id) {
        const { url } = req.body;

        const reviewImage = await ReviewImage.create({ reviewId: req.params.id, url });

        const final = {
            id: reviewImage.id,
            url: reviewImage.url
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

router.put('/:id', requireAuth, verifyReview, validateReviewBody, async (req, res, next) => {
    const oldReview = await Review.findByPk(req.params.id);

    if(oldReview.userId == req.user.id) {
        let { review, stars } = req.body;

        stars = stars.toFixed();

        if (stars > 5 || stars < 1) {
            const err = new Error("Bad Request");
            err.title = "Bad Request";
            err.errors = { stars: "Stars must be an integer from 1 to 5"};
            err.status = 400;
            return next(err);
        }

        const values = { review, stars, updatedAt: new Date() };

        await oldReview.update(values);

        await oldReview.save();

        const final = {
            id: oldReview.id,
            userId: oldReview.userId,
            spotId: oldReview.spotId,
            review: oldReview.review,
            stars: oldReview.stars,
            createdAt: oldReview.createdAt,
            updatedAt: oldReview.updatedAt
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

router.delete('/:id', requireAuth, verifyReview, async (req, res, next) => {
    const review = await Review.findByPk(req.params.id);

    if (review.userId == req.user.id) {
        await review.destroy();

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