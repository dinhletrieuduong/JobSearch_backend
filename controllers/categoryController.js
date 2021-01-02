
const Category = require('./../models/Category')

exports.GetAllCategories = async (req, res, next) => {
    try {
        let cates = await Category.find({})

        res.json(cates);
    } catch (error) {
        next(error)
    }
}

exports.AddNewCategory = async (req, res, next) => {
    try {
        const category = new Category({
            category: req.body.category,
        })

        await category.save();
        res.json(category);
    } catch (error) {
        next(error)
    }
}

