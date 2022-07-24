/* Ce fichier contient le schéma des données utilisateurs, pour la base de données MongoDB Atlas */

/* --- IMPORT --- */
/* package 'Mongoose' */
const mongoose = require("mongoose");
/* package 'mongoose-unique-validator' */
const uniqueValidator = require("mongoose-unique-validator");

/* --- SCHEMA --- */
/* schema des données utilisateurs */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/* --- PLUG-IN --- */
/* assure l'unicité des données désirées (email) */
userSchema.plugin(uniqueValidator);

/* EXPORT du schema des données utilisateurs */
module.exports = mongoose.model("User", userSchema);
