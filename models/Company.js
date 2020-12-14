const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    companyName: {type: String, required: true},
    companySize: {type: Number, required: true},
    companyWebsite: {type: String, required: true},
    companyEmail: {type: String, required: true},
    logo: {type: String, required: false},
    address: {type: String, required: false},
    hotline: {type: String, required: false},
    categories: {type: [String], required: true},
    
    isValidated: {type: Boolean, default: false},
    isBanned: {type: Boolean, default: false},
    registeredDate: {type: Date, default: Date.now() },
    modifiedDate: {type: Date, default: Date.now() },
});

module.exports = Company = mongoose.model('company', CompanySchema);
