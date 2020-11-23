const express = require('express');
const router = express.Router();
const passportJWT = require('../middlewares/passportJWT')();

const employerController = require('../controllers/employerController');

// @route   Post api/employer/
// @desc    Post info employer
// @access  public
router.post('/', passportJWT.authenticate(), employerController.PostInfo);

// @route   Post api/employer/company
// @desc    Post company info employer
// @access  public
router.post('/company', passportJWT.authenticate(), employerController.UpdateCompanyInfo);



module.exports = router;
