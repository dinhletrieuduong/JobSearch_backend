const path = require('path');
const multer = require('multer');
  
module.exports = (folderName) => {
    return multer({
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
                return cb(new Error("Only images are allow"));
            }
            cb(null, true);
        },
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, `public/uploads/${folderName}/`)
            },
            filename: function (req, file, cb) {
              cb(null, Date.now() + '.jpg') //Appending .jpg
            }
          }),
        // dest: `public/uploads/${folderName}/`
    })
}