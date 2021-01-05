const express = require('express');
const router = express.Router();
const passportJWT = require('../middlewares/passportJWT')();

const jobController = require('../controllers/jobController');

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

// @route   Get api/job/recent
// @desc    Get all Jobs
// @access  public
router.get('/recent', jobController.GetRecentJobs);
router.get('/id/:id', jobController.GetJobByID);
router.get('/quantity/:quantity', jobController.GetJobByID);

// @route   Get api/job/:name&:location&:category&:page&:quantity
// @desc    Get all Jobs have partial search string
// @access  public
router.get('/:name&:location&:category&:page&:quantity', jobController.SearchPartialTextJob)

// @route   Post api/job/
// @desc    Create a new Job
// @access  private
// router.post('/new', passportJWT.authenticate(), multerUploads, jobController.CreateNewJob);
router.post('/new', passportJWT.authenticate(), jobController.CreateNewJob);

router.post('/close', passportJWT.authenticate(), jobController.CloseJob)


router.post('/apply/:jobID', passportJWT.authenticate(), jobController.ApplyJob)

module.exports = router;


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
