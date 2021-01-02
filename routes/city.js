const express = require('express');
const router = express.Router();
const passportJWT = require('../middlewares/passportJWT')();

const City = require('../models/City');

router.get('/', (async (req, res, next) => {
    try {
        let cities = await City.find({})
        res.json(cities);
    }
    catch (e) {
        next(e);
    }
}));

router.post('/', (async (req, res, next) => {
    try {
        let city = new City({
            cityName: req.body.cityName
        })
        await city.save();
        res.json(city);
    }
    catch (e) {
        next(e);
    }
}));


module.exports = router;
