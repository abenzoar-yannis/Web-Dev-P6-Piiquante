/* Ce fichier contient la logique des routes sauces. */

/* --- IMPORT --- */
/* package 'express' */
const express = require("express");
/* chargement de la fonction router d'express */
const router = express.Router();
/* controllers sauces */
const sauceCtrl = require("../controllers/sauce");
/* middleware d'authentification */
const auth = require("../middleware/auth");
/* middleware "multer" */
const multer = require("../middleware/multer-config");

/* --- Logique des ROUTES --- */
/* Création d'une nouvelle sauce (authentification et gestion des images avec multer) */
router.post("/", auth, multer, sauceCtrl.createSauce);

/* EXPORT des routes */
module.exports = router;
