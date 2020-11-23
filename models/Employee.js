const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    account: {type: Schema.Types.ObjectId, ref: 'user'},
    companyName: {type: String, required: false},
    address: {type: String, required: false},
    role: {type: String, required: false},
    phone: {type: String, required: false},

    lastName: {type: String, required: false},
    firstName: {type: String, required: false},
});

module.exports = Employer = mongoose.model('employee', EmployeeSchema);
