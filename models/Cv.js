const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CvSchema = new Schema({
    employee: {type: Schema.Types.ObjectId, ref: 'user'},
    htmlContent: {type: String, required: true},

    createAt: {type: Date, default: Date.now() },
});

module.exports = Cv = mongoose.model('cv', CvSchema);
