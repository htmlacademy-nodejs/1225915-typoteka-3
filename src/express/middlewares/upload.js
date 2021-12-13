const multer = require(`multer`);
const { nanoid } = require(`nanoid`);
const path = require(`path`);
const { UPLOAD_DIR } = require('../constants');

const IMAGES_DIR = path.join('..', UPLOAD_DIR, 'img');
const uploadDirAbsolute = path.resolve(__dirname, IMAGES_DIR);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirAbsolute,
    filename: (req, file, cb) => {
      const uniqueName = nanoid(10);
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    },
  }),
});

module.exports = {
  upload,
};
