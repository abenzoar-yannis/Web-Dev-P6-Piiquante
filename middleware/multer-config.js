/* Ce fichier contient la logique de gestion des fichiers entrants dans les requêtes HTTP */

/* --- IMPORT --- */
/* package 'multer' */
const multer = require("multer");

/* Dictionnaire 'mine_type', qui défini les type de fichiers accepté */
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/* Configuration de multer pour cibler où enregistrer les fichiers entrants */
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
