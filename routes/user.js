/* Ce fichier contient la logique des routes utilisateurs. */

/* --- IMPORT --- */
/* package 'express' */
const express = require("express");
/* controllers utilisateur */
const userCtrl = require("../controllers/user");
/* chargement de la fonction router d'express */
const router = express.Router();

/* --- Logique des ROUTES --- */
/* Création d'un utilisateur */
router.post("/signup", userCtrl.signup);
/* Connexion de l'utilisateur */
router.post("/login", userCtrl.login);

/* EXPORT des routes */
module.exports = router;
