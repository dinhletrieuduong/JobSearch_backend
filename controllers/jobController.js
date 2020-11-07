const jwt_simple = require('jwt-simple');
const nodemailer = require('nodemailer');

const Job = require('../models/Job');

const validationHandler = require('../utils/validationHandler');

const isEmpty = require('../utils/isEmpty');
const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2
const config = require('../configs/config');
cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret
  });

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
    console.log(req.file);
    try {
        const path = req.file.path;

        const uniqueFilename = new Date().toISOString()
        cloudinary.uploader.upload(path, {
            public_id: `jobsearch/${uniqueFilename}`, tags: `Job`
          })
        .then((result) => {
            const image = result.url;
            const newJob = new Job();
            console.log(req.body);
            newJob.companyName = req.body.companyName
            newJob.address = req.body.address
            newJob.jobName = req.body.jobName
            newJob.salary = req.body.salary
            newJob.image = image
            newJob.benefit = req.body.benefit
            return newJob.save().then(() => {
                res.status(200).json({
                    message: 'Create job success',
                })
            })
        })
        .catch((err) => res.status(400).json({
            message: 'something went wrong while processing your request',
            data: { err }
        }));
    } catch (error) {
        next(error);
    }
}