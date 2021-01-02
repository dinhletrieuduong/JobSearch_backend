const jwt_simple = require('jwt-simple');
const nodemailer = require('nodemailer');
const gravatar = require('gravatar');

const User = require('./../models/User');

const config = require('../configs/config');

const validationHandler = require('./../utils/validationHandler');
const {isEmail} = require('./../utils/validators');

const isEmpty = require('./../utils/isEmpty');
const {validateEmail} = require("../utils/validators");

exports.Register = async (req, res, next) => {
    try {
        validationHandler(req);
        const existingUser = await User.findOne({email: req.body.email});
        if (existingUser) {
            const error = new Error("Email already used");
            error.statusCode = 403;
            throw error;
        }
        const avatar = gravatar.url(req.body.email, {
            s: '200', // Size
            r: 'pg', // Rating
            d: 'mm', // default
        });
        let user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = await user.encryptPassword(req.body.password);
        user.avatar = avatar;
        user.lastName = req.body.lastName;
        user.firstName = req.body.firstName;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.role = req.body.role;
        let token = jwt_simple.encode({id: user.id}, config.secretOrKey);

        // let transport = nodemailer.createTransport(config.mailerOption);
        // const message = {
        //     from: config.hostGmail,
        //     to: req.body.email,
        //     subject: 'Validate Account',
        //     text: 'Click this link to validate your account'
        // };
        user = await user.save();

        // await transport.sendMail(message);

        return res.json({user, token});
    } catch (error) {
        next(error);
    }
}
  
exports.Login = async (req, res, next) => {
    try {
        let type = validateEmail(req.body.username);
        const username = req.body.username;
        let user = await User.findOne({username: username}).select("password");
        const password = req.body.password;

        if (type) {
            user = await User.findOne({email: username}).select("password");
        }
        if (!user) {
            const error = new Error("Wrong Credentials");
            error.statusCode = 401;
            throw error;
        }
        const validPassword = await user.validPassword(password);
        if (!validPassword) {
            const error = new Error("Email or Password is wrongs");
            error.statusCode = 401;
            throw error;
        }
        if (user.isBanned) {
            const error = new Error("This Account is banned");
            error.statusCode = 401;
            throw error;
        }

        let token = jwt_simple.encode({id: user.id}, config.secretOrKey);
        return res.json({
            userID: user.id, 
            token
        });
    } catch (error) {
        next(error);
    }
}

exports.me = async (req, res, next) => {
    try {
        let user = await User.findById(req.user);
        return res.json(user);
    } catch (error) {
        next(error);
    }
}

exports.Validate = async (req, res, next) => {
    try {
        let user = await User.findById(req.user);
        if (!user) {
            const error = new Error("User is not existed");
            error.statusCode = 400;
            throw error;
        }
        user.isValidated = true;
        user = await user.save();

        return res.json({user});
    } catch (error) {
        next(error);
    }
}

exports.ForgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user || !user.isValidated) {
            const error = new Error("This account is not exists or validated");
            error.statusCode = 400;
            throw error;
        }
        
        let transport = nodemailer.createTransport(config.mailerOption);
        const message = {
            from: config.hostGmail, // Sender address
            to: req.body.email,         // Single or List of recipients
            subject: 'Forgot Password', // Subject line
            text: 'Click this link to reset your password: ' // Plain text body
        };
        let info = await transport.sendMail(message);
        res.json({message: "Sent to: " + req.body.email});
    } catch (error) {
        next(error);
    }
}

exports.BanAccount = async (req, res, next) => {
    try {
        let user = await User.findOne({username: req.body.username});
        if (!user) {
            const error = new Error("This account is not exists now");
            error.statusCode = 404;
            throw error;
        }
        user.isBanned = true;
        user = await user.save();
        return res.json(user);
    } catch (error) {
        next(error);
    }
}
exports.UnBanAccount = async (req, res, next) => {
    try {
        let user = await User.findOne({username: req.body.username});
        if (!user) {
            const error = new Error("This account is not exists now");
            error.statusCode = 404;
            throw error;
        }
        user.isBanned = false;
        user = await user.save();
        return res.json(user);
    } catch (error) {
        next(error);
    }
}

exports.UpdatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("password");
        console.log(user);
        if (!user) {
            const error = new Error("This account is not exists now");
            error.statusCode = 404;
            throw error;
        }
        user.password = await user.encryptPassword(req.body.newPassword);
        await user.save();
        console.log(user);
        return res.json({message: "Updated!"});
    } catch (error) {
        next(error);
    }
}

exports.UpdateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(user);
        if (!user) {
            const error = new Error("This account is not exists now");
            error.statusCode = 404;
            throw error;
        }
        user.lastName = isEmpty(req.body.lastName) ? user.lastName : req.body.lastName;
        user.firstName = isEmpty(req.body.firstName) ? user.firstName : req.body.firstName;
        user.address = isEmpty(req.body.address) ? user.address : req.body.address;
        user.email = isEmpty(req.body.email) ? user.email : req.body.email;
        user.phone = isEmpty(req.body.phone) ? user.phone : req.body.phone;
        user.modifiedDate = Date.now();

        return res.json({message: "Updated!"});
    } catch (error) {
        next(error);
    }
}

exports.PostReview = async (req, res, next) => {
    try {
        // let user = User.findById(req.user._id);

        let review = new Review({
            employee: req.user._id,
            employer: req.body.employerID,
            rate: req.body.rate,
            comment: isEmpty(req.body.comment) ? '' : req.body.comment
        });

        await review.save();
        res.json({message: 'Posted!'});
    } catch (error) {
        next(error)
    }
}

exports.UpdateEmployerCompanyInfo = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id);
        console.log(user);
        let company = new Company();
        company.companyName = req.body.companyName;
        company.companySize = req.body.companySize;
        company.companyWebsite = req.body.companyWebsite;
        company.companyEmail = req.body.companyEmail;
        company.address = req.body.address;
        company.hotline = req.body.hotline;

        await company.save();
        user.company = company._id;
        await user.update();
        res.json(user);

    } catch (error) {
        next(error)
    }
}

exports.GetCv = async (req, res, next) => {
    try {
        let cv = Cv.find({employee: req.user._id});
        if (!cv) {
            const error = new Error("This account have no Cv");
            error.statusCode = 404;
            throw error;
        }

        res.json(cv);
    }
    catch (e) {
        next(e)
    }
}

exports.AddCv = async (req, res, next) => {
    try {
        let cv = new Cv({
            htmlContent: req.body.htmlContent,
        });

        await cv.save();

        res.json({message: 'Success'})
    }
    catch (e) {
        next(e)
    }
}

exports.DeleteCv = async (req, res, next) => {
    try {
        await Cv.findByIdAndDelete(req.body.cvID);

        res.json({message: 'Success'})
    }
    catch (e) {
        next(e)
    }
}