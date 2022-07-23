/* IMPORT d'express */
const express = require("express");
require("dotenv").config({ path: ".env" });

/* Creation de l'application express */
const app = express();

/* Reponse du seveur pour tout type de requête */
app.use((req, res) => {
  res.json({ message: "Votre requête a bien été reçue !" });
});

/* EXPORT de l'application APP */
module.exports = app;
