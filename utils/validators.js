const {body} = require('express-validator');

exports.isEmail = body('email').isEmail().withMessage("Email field must contain a correct email");

exports.hasPassword = body('password').exists().isLength({min: 6}).withMessage("Password is required. Min length is 6 characters");

exports.hasUsername = body('username').isLength({min: 5}).withMessage("Username is required. Min length is 5 characters");

exports.validateEmail = (elementValue) => {
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue);
}