const express = require('express');
const router = express.Router();
const passportJWT = require('../middlewares/passportJWT')();

const jobController = require('../controllers/jobController');
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

// @route   Get api/job/all
// @desc    Get all Jobs
// @access  public
router.get('/all', jobController.GetAll);

// @route   Post api/job/
// @desc    Create a new Job
// @access  private
router.post('/', passportJWT.authenticate(), multerUploads, jobController.CreateNewJob);

// router.post('/upload', multer({storage}).single('image'), function (req, res, next) {
//     const uniqueFilename = new Date().toISOString();
//     let streamUpload = (req) => {
//         return new Promise((resolve, reject) => {
//             let stream = cloudinary.uploader.upload_stream(
//               (error, result) => {
//                 if (result) {
//                   resolve(result);
//                 } else {
//                   reject(error);
//                 }
//               }
//             );
    
//            streamifier.createReadStream(req.file.buffer).pipe(stream);
//         });
//     };
    
//     async function upload(req) {
//         let result = await streamUpload(req);
//         console.log(result);
//     }
    
//     upload(req);
//     }
// );
    
module.exports = router;