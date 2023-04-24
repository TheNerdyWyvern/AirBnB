const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');

const verifySpotImage = async (req, _res, next) => {
    const spotImages = await SpotImage.findAll();

    const spotImage = spotImages.find(spotImage => spotImage.id == req.params.id);

    if (!spotImage) {
        const err = new Error("Couldn't find a Spot Image with the specified id");
        err.title = "Resource Not Found";
        err.errors = { message: "Spot Image couldn't be found."};
        err.status = 404;
        return next(err);
    }

    next();
}

const router = express.Router();

router.delete('/:id', requireAuth, verifySpotImage, async (req, res, next) => {
    const spotImage = await SpotImage.findByPk(req.params.id);

    if (spotImage.userId == req.user.id) {
        await spotImage.destroy();

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