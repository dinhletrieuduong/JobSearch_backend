const express = require('express');
const router = express.Router();

const passportJWT = require('../middlewares/passportJWT')();

const jobController = require('../controllers/jobController');
const {isEmail, hasPassword, hasUsername} = require('../utils/validators');

// @route   Get api/job/all
// @desc    Get all Jobs
// @access  public
router.get('/all', jobController.GetAll);

// @route   Post api/job/
// @desc    Create a new Job
// @access  private
router.post('/', [hasPassword, hasUsername, isEmail], jobController.CreateNewJob);

module.exports = router;