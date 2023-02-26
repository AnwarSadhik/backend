const multer = require('multer');
const path = require('path');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req,file,cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".mp4" && ext !== ".mkv" && ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
            cb(new Error("Invalid file extension"),false)
            return;
        }
        cb(null, true);
    }
})