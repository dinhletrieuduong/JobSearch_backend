// const cloudinary = require('../models/Cloudinary')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})
const cloudinary = require('cloudinary').v2;
const keys = require('../configs/config');
//lấy trong https://cloudinary.com/console/welcome
cloudinary.config({
  cloud_name: keys.cloudinary_name,
  api_key: keys.cloudinary_api_key,
  api_secret: keys.cloudinary_api_secret
});

let self = module.exports = {
  uploadSingleFile: (req, res, next) => {
    const upload = multer({
      storage
    }).single('image');
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          errors: err
        })
      }
      // SEND FILE TO CLOUDINARY
      const path = req.file.path
      const uniqueFilename = new Date().toISOString()
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          path, {
            public_id: `tikin/${uniqueFilename}`,
            tags: `Product`
          }
        )
          .then((image) => {
            // remove file from server
            const fs = require('fs');
            fs.unlinkSync(path);
            console.log('====================================');
            console.log("UPLOADED");
            console.log('====================================');
            // return image details
            resolve(image);
          })
          .catch(err => {
            if (err) return reject(err);
          })
      })

    })
  }
}