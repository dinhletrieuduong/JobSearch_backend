const Employee = require("../models/Employee")


exports.PostInfo = async (req, res, next) => {
    try {
        let employeeInfo = new Employee();
        
        employeeInfo.lastName = req.body.lastName;
        employeeInfo.firstName = req.body.firstName;
        employeeInfo.account = req.user._id;
        employeeInfo.phone = req.body.phone;
        employeeInfo.role = req.body.role;
        employeeInfo.address = req.body.address;

        await employeeInfo.save();
        res.json(employeeInfo);

    } catch (error) {
        next(error)
    }
}

exports.PostReview = (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }  
}