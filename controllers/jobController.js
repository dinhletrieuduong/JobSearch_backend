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
exports.GetRecentJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().sort({createdAt: 1}).limit(20);
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
exports.GetJobByQuantity = async (req, res, next) => {
    try {
        const job = await Job.find().sort({createdAt: 1}).limit(req.params.quantity);
        if (!job) {
            const error = new Error("There is no jobs now");
            error.statusCode = 404;
            throw error;
        }

        return res.json(job);
    } catch (error) {
        next(error);
    }
}
exports.GetJobByID = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            const error = new Error("There is no jobs have that ID");
            error.statusCode = 404;
            throw error;
        }

        return res.json(job);
    } catch (error) {
        next(error);
    }
}
exports.CreateNewJob = async (req, res, next) => {
    // console.log(req.file);
    try {
        // const path = req.file.path;

        // const uniqueFilename = new Date().toISOString()
        // cloudinary.uploader.upload(path, {
        //     public_id: `jobsearch/${uniqueFilename}`, tags: `Job`
        //   })
        // .then((result) => {
        //     const image = result.url;
        //     const newJob = new Job();
        //     newJob.companyName = req.body.companyName
        //     newJob.address = req.body.address
        //     newJob.jobName = req.body.jobName
        //     newJob.jobDescription = req.body.jobDescription
        //     newJob.salaryTo = req.body.salaryTo
        //     newJob.image = image
        //     newJob.benefit = req.body.benefit
        //     newJob.location = req.body.location
        //     newJob.categories = req.body.categories
        //     return newJob.save().then(() => {
        //         res.status(200).json({
        //             message: 'Create job success',
        //         })
        //     })
        // })
        // .catch((err) => res.status(400).json({
        //     message: 'something went wrong while processing your request',
        //     data: { err }
        // }));
        const newJob = new Job();
        newJob.employer = req.user._id
        newJob.companyName = req.body.companyName
        newJob.address = req.body.address
        newJob.jobName = req.body.jobName
        newJob.jobDescription = req.body.jobDescription
        newJob.salaryTo = req.body.salaryTo
        newJob.image = req.body.image
        newJob.benefit = req.body.benefit
        newJob.location = req.body.location
        newJob.categories = req.body.categories
        await newJob.save()
        console.log(newJob)
        res.status(200).json({
            message: 'Create job success',
        })
    } catch (error) {
        next(error);
    }
}

exports.CloseJob = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}
exports.ApplyJob = async (req, res, next) => {
    try {
        // console.log(req.user)
        let job = await Job.findById(req.params.jobID);
        console.log(job)
        if (!job) {
            const error = new Error("Job not found");
            error.statusCode = 404;
            throw error;
        }
        // Job.findAndUpdate
        job.candidates.push(req.user._id)
        await job.save();
        res.json({message: 'Success!'});
    } catch (error) {
        next(error);
    }
}

exports.SearchFullTextJob = async (req, res, next) => {
    try {
        let result = await Job.find({$text: {$search: req.params.name}})
        // .skip(20)
        // .limit(10)
        res.json(result);

    }
    catch (e) {
        next(e);
    }
}

exports.SearchPartialTextJob = async (req, res, next) => {
    try {
        let result
        let page = Number(req.params.page) - 1
        let quantity = Number(req.params.quantity)
        if (req.params.location === '-1') {
            result= await Job.find({
                jobName: { $regex: req.params.name, $options: "i" },
            }).skip(page*quantity).limit(quantity);
        }
        else if (req.params.category === '-1' || req.params.category === 'Category') {
            result= await Job.find({
                jobName: { $regex: req.params.name, $options: "i" },
                location: { $regex: req.params.location ? req.params.location : "", $options: "i" },
            }).skip(page*quantity).limit(quantity);
        }
        else {
            result= await Job.find({
                jobName: { $regex: req.params.name, $options: "i" },
                location: { $regex: req.params.location ? req.params.location : "", $options: "i" },
                categories: { $regex: req.params.category ? req.params.category : "", $options: "i" },
            }).skip(page*quantity).limit(quantity);
        }
        res.json(result);
    }
    catch (e) {
        next(e)
    }
}

exports.GetJobByEmployer = async (req, res, next) => {
    try {
        let jobs = await Job.find({employer: req.user._id});

        res.json(jobs);
    }
    catch (e) {
        next(e)
    }
}