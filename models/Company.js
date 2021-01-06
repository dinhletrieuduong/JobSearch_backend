const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    companyName: {type: String, required: false},
    companySize: {type: Number, required: false},
    companyWebsite: {type: String, required: false},
    companyEmail: {type: String, required: false},
    logo: {type: String, required: false},
    address: {type: String, required: false},
    location: {type: String, required: false},
    hotline: {type: String, required: false},
    categories: {type: [String], required: false},

    isValidated: {type: Boolean, default: false},
    isBanned: {type: Boolean, default: false},
    registeredDate: {type: Date, default: Date.now() },
    modifiedDate: {type: Date, default: Date.now() },
});

module.exports = Company = mongoose.model('company', CompanySchema);
