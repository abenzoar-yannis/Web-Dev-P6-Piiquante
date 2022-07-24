/* Ce fichier contient le schéma des données sauces, pour la base de données MongoDB Atlas */

/* --- IMPORT --- */
/* package 'Mongoose' */
const mongoose = require("mongoose");

/* --- SCHEMA --- */
/* schema des données sauces */
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  manufacturer: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  mainPepper: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true, min: 1, max: 10 },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], required: true, default: [] },
  usersDisliked: { type: [String], required: true, default: [] },
});

/* EXPORT du schema des données sauces */
module.exports = mongoose.model("Sauce", sauceSchema);
