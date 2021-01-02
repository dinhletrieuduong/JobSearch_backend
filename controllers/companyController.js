const Company = require('../models/Company');

exports.SearchPartialTextCompany = async (req, res, next) => {
    try {
        let page = Number(req.params.page) - 1
        let quantity = Number(req.params.quantity)
        let result
        if (req.params.location === '-1') {
            result= await Company.find({
                companyName: { $regex: req.params.name, $options: "i" },
            }).skip(page*quantity).limit(quantity);;
        }
        else if (req.params.category === '-1' || req.params.category === 'Category') {
            result= await Company.find({
                companyName: { $regex: req.params.name, $options: "i" },
                location: { $regex: req.params.location ? req.params.location : "", $options: "i" },
            }).skip(page*quantity).limit(quantity);;
        }
        else {
            result= await Company.find({
                companyName: { $regex: req.params.name, $options: "i" },
                location: { $regex: req.params.location ? req.params.location : "", $options: "i" },
                categories: { $regex: req.params.category ? req.params.category : "", $options: "i" },
            }).skip(page*quantity).limit(quantity);;
        }
        res.json(result);
    }
    catch (e) {
        next(e)
    }
}