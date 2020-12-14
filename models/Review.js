const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    employer: {type: Schema.Types.ObjectId, ref: 'user'},
    employee: {type: Schema.Types.ObjectId, ref: 'user'},
    rate: {type: Number, required: true},
    comment: {type: String, required: false},

    isValidated: {type: Boolean, default: false}, // Admin se kiem duyet noi dung 
    isBanned: {type: Boolean, default: false}, // Cam nhung review sai su that 
    reviewDate: {type: Date, default: Date.now() },
});

module.exports = Review = mongoose.model('review', ReviewSchema);
