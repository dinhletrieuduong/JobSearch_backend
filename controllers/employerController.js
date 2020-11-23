const Employer = require("../models/Employer")
const Company = require("../models/Company")


exports.PostInfo = async (req, res, next) => {
    try {
        let employerInfo = new Employer();
        employerInfo.lastName = req.body.lastName;
        employerInfo.firstName = req.body.firstName;
        employerInfo.account = req.user._id;
        employerInfo.phone = req.body.phone;
        employerInfo.role = req.body.role;

        await employerInfo.save();
        res.json(employerInfo);

    } catch (error) {
        next(error)
    }
}

exports.UpdateCompanyInfo = async (req, res, next) => {
    try {
        let employerInfo = await Employer.findOne({account: req.user._id});
        console.log(employerInfo);
        let company = new Company();
        company.companyName = req.body.companyName;
        company.companySize = req.body.companySize;
        company.companyWebsite = req.body.companyWebsite;
        company.companyEmail = req.body.companyEmail;
        company.address = req.body.address;
        company.hotline = req.body.hotline;
        
        await company.save();
        employerInfo.company = company._id;
        await employerInfo.update();
        res.json(employerInfo);
        
    } catch (error) {
        next(error)
    }  
}