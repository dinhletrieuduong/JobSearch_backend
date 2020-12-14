
const Company = require('../models/Company');


exports.SearchPartialTextCompany = async (req, res, next) => {
    try {
        let result = await Company.find({
            name: { $regex: req.params.name, $options: "i" },
            location: { $regex: req.params.location, $options: "i" },
            section: { $regex: req.params.section, $options: "i" },
        });
        console.log(result);
        res.json(result);
    }
    catch (e) {
        next(e)
    }
}