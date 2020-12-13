const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    email: {type: String, required: true},
    // username: {type: String, required: true},
    password: {type: String, required: true, select: false},
    role: {type: Number, required: false}, // Employee hay Employer
    phone: {type: String, required: false},
    lastName: {type: String, required: false},
    firstName: {type: String, required: false},

    company: {type: Schema.Types.ObjectId, ref: 'company'},
    companyName: {type: String, required: false},
    address: {type: String, required: false},
    jobRole: {type: String, required: false},


    isValidated: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    isBanned: {type: Boolean, default: false},
    registeredDate: {type: Date, default: Date.now() },
    modifiedDate: {type: Date, default: Date.now() },
});

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}
UserSchema.methods.validPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = User = mongoose.model('user', UserSchema);
