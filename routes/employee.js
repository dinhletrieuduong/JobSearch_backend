const express = require('express');
const router = express.Router();
const passportJWT = require('../middlewares/passportJWT')();

const employeeController = require('../controllers/employeeController');

// @route   Post api/employee/
// @desc    Post info employee
// @access  public
router.post('/', passportJWT.authenticate(), employeeController.PostInfo);



module.exports = router;
