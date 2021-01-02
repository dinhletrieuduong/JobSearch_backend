const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    companyName: {type: String, required: false},
    jobName: {type: String, required: true},
    jobDescription: {type: String, required: true},
    image: {type: String, required: false},
    benefit: {type: String, required: true},
    location: {type: String, required: false},
    salaryTo: {type: String, required: true},
    categories: {type: [String], required: true},
    isClosed: {type: Boolean, default: false},

    createdAt: {type: Date, default: Date.now()},
    // jobBudget: {type: String, required: false}, // Index to easy to search and find for job seekers
    // location: {type: String, required: false},
    // isRemoted: {type: Boolean, required: true},
    // salaryType: {type: String, required: true}, // range, starting at, up to, exact rate
    // salaryStart: {type: String, required: true},
    // salaryTypePay: {type: String, required: true}, // per hour, per month, per week, per day, per week
    // experienceRequirement: {type: [String], required: true}, // minium 1 year of Software engineer or Mobile or ... and Preferred or Required
    // educationRequirement: {type: String, required: true}, // middle, high school, bachelor's, master's and Preferred or Required
    // locationRequirement: {type: String, required: true}, // HCM and Preferred or Required
    // languageRequirement: {type: [String], required: true},
    // typeOfEmployment: {type: String, require: true}, // Full-time, part-time, either full time or part time
    // contractType: {type: String , required: true}, //Internship, Temporary, Contract, Commission, New-Grad, permanent
    // isResumeNeeded: {type: Boolean, default: false}, // 1 - Yes, 0 - No, -1 - Optional
    // deadline: {type: Date, required: false },
});
JobSchema.index({companyName: 'text', jobName: 'text'});
// schema.index({'$**': 'text'});
module.exports = Job = mongoose.model('job', JobSchema);
