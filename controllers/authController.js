const jwt_simple = require('jwt-simple');
const nodemailer = require('nodemailer');
const gravatar = require('gravatar');

const User = require('./../models/User');
const Resume = require('../models/Resume');

const config = require('../configs/config');
const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret
});
const validationHandler = require('./../utils/validationHandler');
const isEmpty = require('./../utils/isEmpty');
const {validateEmail} = require("../utils/validators");

exports.Register = async (req, res, next) => {
    try {
        validationHandler(req);
        if (isEmpty(req.body.username) || req.body.username.length < 5) {
            const error = new Error("Username is required. Min length is 5 characters");
            error.statusCode = 403;
            throw error;
        }
        if (isEmpty(req.body.password) || req.body.password.length < 6) {
            const error = new Error("Password is required. Min length is 6 characters");
            error.statusCode = 403;
            throw error;
        }
        if (isEmpty(req.body.email)) {
            const error = new Error("Email field must contain a correct email");
            error.statusCode = 403;
            throw error;
        }

        const existingUser = await User.findOne({username: req.body.username});
        if (existingUser) {
            const error = new Error("Username already used");
            error.statusCode = 403;
            throw error;
        }
        const existingEmail = await User.findOne({email: req.body.email});
        if (existingEmail) {
            const error = new Error("Email already used");
            error.statusCode = 403;
            throw error;
        }

        // const path = req.file.path;
        // const uniqueFilename = new Date().toISOString();
        // let result = await cloudinary.uploader.upload(path, {
        //     public_id: `jobsearch/${uniqueFilename}`, tags: `Job`
        // })
        // const image = result.url;
        // const avatar = gravatar.url(req.body.email, {
        //     s: '200', // Size
        //     r: 'pg', // Rating
        //     d: 'mm', // default
        // });
        let user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = await user.encryptPassword(req.body.password);
        // user.avatar = avatar;
        user.avatar = req.body.avatar;
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
        
        if (user.role === 1) {
            const company = new Company();
            company.companyName = user.firstName + " " + user.lastName;
            company.employer = user._id;
            await company.save();
        }
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
        let user = await User.findOne({username: username}).select(["password", "role"]);
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
            role: user.role,
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
        let user = await User.findOne({email: req.body.email}).select('password');
        // if (!user || !user.isValidated) {
        if (!user) {
            // const error = new Error("This account is not exists or validated");
            const error = new Error("This account is not exists");
            error.statusCode = 400;
            throw error;
        }
        var randomstring = Math.random()                        // Generate random number, eg: 0.123456
            .toString(36)           // Convert  to base-36 : "0.4fzyo82mvyr"
            .slice(-8);// Cut off last 8 characters : "yo82mvyr"
        // user = await User.findOneAndUpdate({email: req.body.email}, {password: randomstring});
        user.password = await user.encryptPassword(randomstring);
        user.save();

        let transport = nodemailer.createTransport(config.mailerOption);
        const message = {
            from: config.hostGmail, // Sender address
            to: req.body.email,         // Single or List of recipients
            subject: 'Forgot Password', // Subject line
            text: 'Your new password is: ' + randomstring// Plain text body
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
        if (!user) {
            const error = new Error("This account is not exists now");
            error.statusCode = 404;
            throw error;
        }
        if (user.password !== req.body.oldPassword) {
            const error = new Error("Old password does not match");
            error.statusCode = 400;
            throw error;
        }
        user.password = await user.encryptPassword(req.body.newPassword);
        await user.save();
        return res.json({message: "Updated!"});
    } catch (error) {
        next(error);
    }
}

exports.UpdateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
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
        await user.save();
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
        let resumes = await Resume.find({employee: req.user._id});
        if (!resumes) {
            const error = new Error("This account have no Resume");
            error.statusCode = 404;
            throw error;
        }
        res.json(resumes);
    }
    catch (e) {
        next(e)
    }
}
exports.GetCvDetail = async (req, res, next) => {
    try {
        let resume = await Resume.findById(req.params.id);
        if (!resume) {
            const error = new Error("There no Resume have this id");
            error.statusCode = 404;
            throw error;
        }
        res.json(resume);
    }
    catch (e) {
        next(e)
    }
}

exports.AddCv = async (req, res, next) => {
    try {
        let cv = new Resume({
            employee: req.user._id,
            htmlContent: req.body.htmlContent,
        });

        await cv.save();

        res.json({message: 'Success'})
    }
    catch (e) {
        next(e)
    }
}

exports.UpdateCv = async (req, res, next) => {
    try {
        await Resume.findByIdAndUpdate(req.params.id, {htmlContent: req.body.htmlContent});
        res.json({message: 'Success'})
    }
    catch (e) {
        next(e)
    }
}
exports.DeleteCv = async (req, res, next) => {
    try {
        await Resume.findByIdAndDelete(req.params.id);
        res.json({message: 'Success'})
    }
    catch (e) {
        next(e)
    }
}

exports.GetUserByID = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            const error = new Error("There no id exists in database");
            error.statusCode = 404;
            throw error;
        }
        res.json(user)
    }
    catch (e) {
        next(e)
    }
}
