const express = require('express');
const router = express.Router();

const passportJWT = require('../middlewares/passportJWT')();

const authController = require('../controllers/authController');
const {isEmail, hasPassword, hasUsername} = require('../utils/validators');

// @route   Post api/auth/login
// @desc    Login to system
// @access  private
router.post('/login', authController.Login);

// @route   Post api/auth/register
// @desc    Register an account
// @access  private
router.post('/register', [hasPassword, hasUsername, isEmail], authController.Register);

// @route   Post api/auth/validate
// @desc    Send an email to validate account
// @access  private
router.post('/validate', passportJWT.authenticate(), authController.Validate);

// @route   Post api/auth/forgot
// @desc    Send an email with link to reset password
// @access  private
router.post('/forgot', authController.ForgotPassword);

// @route   Get api/auth/current
// @desc    Return current user
// @access  private
router.get('/me', passportJWT.authenticate(), authController.me);

// @route   Post api/auth/updatePassword
// @desc    Update password Account
// @access  private
router.post('/updatePassword', passportJWT.authenticate(), authController.UpdatePassword);

// @route   Post api/auth/updatePassword
// @desc    Update password Account
// @access  private
router.post('/updateProfile', passportJWT.authenticate(), authController.UpdateProfile);

// @route   Post api/auth/ban
// @desc    Ban an account
// @access  private
router.post('/ban', authController.BanAccount);

// @route   Post api/auth/ban
// @desc    Ban an account
// @access  private
router.post('/unBan', authController.UnBanAccount);

module.exports = router;