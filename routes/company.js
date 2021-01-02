const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// @route   Get api/company/:companyName
// @desc    Find company by name
// @access  public
router.get('/:name&:location&:category', companyController.SearchPartialTextCompany);

