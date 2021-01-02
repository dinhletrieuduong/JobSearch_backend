const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
    employee: {type: Schema.Types.ObjectId, ref: 'user'},
    htmlContent: {type: String, required: true},

    createAt: {type: Date, default: Date.now() },
});

module.exports = Resume = mongoose.model('resume', ResumeSchema);
