const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployerSchema = new Schema({
    account: {type: Schema.Types.ObjectId, ref: 'user'},
    company: {type: Schema.Types.ObjectId, ref: 'company'},
    phone: {type: String, required: false},
    role: {type: String, required: false},

    lastName: {type: String, required: false},
    firstName: {type: String, required: false},
});

module.exports = Employer = mongoose.model('employer', EmployerSchema);
