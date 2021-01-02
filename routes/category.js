const express = require('express');
const router = express.Router();
const passportJWT = require('../middlewares/passportJWT')();

const categoryController = require('../controllers/categoryController');

// @route   Get api/review/:employerID
// @desc    Get all review
// @access  public
router.get('/', categoryController.GetAllCategories);

// @route   Post api/review/:employerID
// @desc    Review, comment Job
// @access  private
router.post('/', categoryController.AddNewCategory);


module.exports = router;
