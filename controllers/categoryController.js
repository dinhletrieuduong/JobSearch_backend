
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
        let isExisted = await Category.findOne({category: req.body.category});
        if (!isExisted) {
            const category = new Category({
                category: req.body.category,
            })

            await category.save();
            res.json(category);
        }
        else {
            res.status(400).json({message: 'Category already exists'});
        }
    } catch (error) {
        next(error)
    }
}

