const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    companyName: {type: String, required: false},
    address: {type: String, required: false},
    email: {type: String, required: false},
    hr: {type: String, required: true},
    password: {type: String, required: true, select: false},
    role: {type: String, required: false},
    phone: {type: String, required: false},

    isValidated: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    isBanned: {type: Boolean, default: false},
    registeredDate: {type: Date, default: Date.now() },
    modifiedDate: {type: Date, default: Date.now() },
});


module.exports = User = mongoose.model('company', CompanySchema);
