/* IMPORT de multer */
const multer = require("multer");

/* Dictionnaire de mine_type pour la gestion des extention des fichiers */
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/* Configuration de multer */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

/* EXPORT du middleware pour la gestion du stockage d'images */
module.exports = multer({ storage }).single("image");
