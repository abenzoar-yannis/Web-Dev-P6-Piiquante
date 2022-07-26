/* --- IMPORT des PACKAGES --- */
/* package 'express' */
const express = require("express");
/* package 'mongoose */
const mongoose = require("mongoose");
/* package de 'dotenv' et charge les variables d'environnement stockées dans le fichier '.env' */
require("dotenv").config({ path: ".env" });

/* donne accès au chemin de fichiers */
const path = require("path");

/* chargement des fonctions d'express */
const app = express();

/* --- IMPORT ROUTES --- */
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

/* --- MIDDLEWARE --- */
/* Permet l'extractionn du corp de la requête.
Autre facon de faire avec 'bobyParser' */
app.use(express.json());

/* --- DATABASE --- */
/* Connection à la base de donnée MongoDB Atlas */
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/* --- CORS --- */
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

/* --- ROUTES PARAMETRE --- */
/* gestion des requête vers le dossier '/images' */
app.use("/images", express.static(path.join(__dirname, "images")));
/* Paramétrage des chemins pour les routes */
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

/* EXPORT de l'application */
module.exports = app;
