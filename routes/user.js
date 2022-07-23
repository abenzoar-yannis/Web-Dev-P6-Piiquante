/* IMPORT d'express */
const express = require("express");
/* Création du router */
const router = express.Router();

/* IMPORT des controllers utilisateur */
const userCtrl = require("../controllers/user");

/* Les logiques de routine utilisateur */
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

/* EXPORT des routes */
module.exports = router;
