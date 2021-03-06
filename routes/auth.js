const express = require('express');
const router = express.Router();

const passportJWT = require('../middlewares/passportJWT')();

const authController = require('../controllers/authController');
const {isEmail, hasPassword, hasUsername} = require('../utils/validators');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
// const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');

// @route   Post api/auth/login
// @desc    Login to system
// @access  private
router.post('/login', [isEmail, hasPassword, hasUsername], authController.Login);

// @route   Post api/auth/register
// @desc    Register an account
// @access  private
router.post('/register', multerUploads, authController.Register);

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

// @route   Post api/auth/company
// @desc    Post company info employer
// @access  private
router.post('/companyEmployer', passportJWT.authenticate(), authController.UpdateEmployerCompanyInfo);


// @route   Post api/auth/cv
// @desc    Manage Cv
// @access  private
router.get('/resume', passportJWT.authenticate(), authController.GetCv);
router.get('/resume/:id', passportJWT.authenticate(), authController.GetCvDetail);
router.post('/resume', passportJWT.authenticate(), authController.AddCv);
router.put('/resume/:id', passportJWT.authenticate(), authController.UpdateCv);
router.delete('/resume/:id', passportJWT.authenticate(), authController.DeleteCv);
router.get('/:id', authController.GetUserByID);
// router.get('/candidate/', passportJWT.authenticate(), authController.SearchPartitionTextCandidate);

module.exports = router;