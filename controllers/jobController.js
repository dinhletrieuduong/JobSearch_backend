const jwt_simple = require('jwt-simple');
const nodemailer = require('nodemailer');

const Job = require('../models/Job');

const config = require('../configs/config');

const validationHandler = require('../utils/validationHandler');

const isEmpty = require('../utils/isEmpty');
const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2

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
        console.log(req.file);
        const path = req.file.path;
        const uniqueFilename = new Date().toISOString()
        cloudinary.uploader.upload(path, {
            public_id: `jobsearch/${uniqueFilename}`, tags: `Job`
          })
        .then((result) => {
            const image = result.url;

            const newJob = {
                
            };
            return res.status(200).json({
                newJob,
                messge: 'Your image has been uploded successfully to cloudinary',
                data: { image }
            })
        }).catch((err) => res.status(400).json({
            messge: 'something went wrong while processing your request',
            data: { err }
        }));
    } catch (error) {
        next(error);
    }
}