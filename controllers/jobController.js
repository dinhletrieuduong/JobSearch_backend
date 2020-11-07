const jwt_simple = require('jwt-simple');
const nodemailer = require('nodemailer');

const Job = require('../models/Job');

const config = require('../configs/config');

const validationHandler = require('../utils/validationHandler');

const isEmpty = require('../utils/isEmpty');

exports.GetAll = async (req, res, next) => {
    try {
        const jobs = await Job.find();
        if (!jobs) {
            const error = new Error("There is no jobs now");
            error.statusCode = 404;
            throw error;
        }

        return res.json(jobs);
    } catch (error) {
        next(error);
    }
}
exports.CreateNewJob = async (req, res, next) => {
    try {
        const jobs = await Job.find();
        if (!jobs) {
            const error = new Error("There is no jobs now");
            error.statusCode = 404;
            throw error;
        }

        return res.json(jobs);
    } catch (error) {
        next(error);
    }
}