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
        let isExisted = City.find({cityName: req.body.cityName});
        if (!isExisted) {
            let city = new City({
                cityName: req.body.cityName
            })
            await city.save();
            res.json(city);
        }
        else {
            res.status(400).json({message: 'City name already exists'});
        }
    }
    catch (e) {
        next(e);
    }
}));


module.exports = router;
