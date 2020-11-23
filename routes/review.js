const express = require('express');
const router = express.Router();
const passportJWT = require('../middlewares/passportJWT')();

const reviewController = require('../controllers/reviewController');

// @route   Get api/review/:employerID
// @desc    Get all review
// @access  public
router.get('/:employerID', reviewController.GetAllReviews);

// @route   Post api/review/:employerID
// @desc    Review, comment Job
// @access  private
router.post('/:employerID', passportJWT.authenticate(), reviewController.PostReview);


module.exports = router;
