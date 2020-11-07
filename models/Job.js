const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    companyName: {type: String, required: false},
    jobName: {type: String, required: false},
    address: {type: String, required: false},
    salary: {type: String, required: true},
    image: {type: String, required: false},
    benefit: {type: String, required: false},
    isClosed: {type: Boolean, default: false},
    modifiedDate: {type: Date, default: Date.now() },
});

module.exports = User = mongoose.model('job', JobSchema);
