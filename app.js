/* IMPORT d'express */
const express = require("express");
/* IMPORT de dotenv */
require("dotenv").config({ path: ".env" });
/* IMPORT de mongoose */
const mongoose = require("mongoose");

/* Creation de l'application express */
const app = express();
/* Permet l'extractionn du corp de la requête en JSON.
Autre facon de faire avec bobyParser */
app.use(express.json());

/* Variables pour les identifiants de connection à MongoDB Atlas */
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

/* Connection à la base de donnée MongoDB Atlas */
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@firstcluster.2ndaq.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/* Paramétrage de CORS = Cross Origin Resource Sharing  */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/* Reponse du seveur pour tout type de requête */
app.use((req, res) => {
  res.json({ message: "Votre requête a bien été reçue !" });
});

/* EXPORT de l'application APP */
module.exports = app;
