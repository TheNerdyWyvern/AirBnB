const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');

const verifyReviewImage = async (req, _res, next) => {
    const reviewImages = await ReviewImage.findAll();

    const reviewImage = reviewImages.find(reviewImage => reviewImage.id == req.params.id);

    if (!reviewImage) {
        const err = new Error("Couldn't find a Review Image with the specified id");
        err.title = "Resource Not Found";
        err.errors = { message: "Review Image couldn't be found."}; 
        err.status = 404;
        return next(err);
    }

    next();
}

const router = express.Router();

router.delete('/:id', requireAuth, verifyReviewImage, async (req, res) => {
    const reviewImage = await ReviewImage.findByPk(req.params.id);

    if (reviewImage.userId == req.user.id) {
        await reviewImage.destroy();

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