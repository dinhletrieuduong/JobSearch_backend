const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    cityName: {type: String, required: true},

});

module.exports = City = mongoose.model('city', CitySchema);
