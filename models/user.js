/* IMPORT de Mongoose */
const mongoose = require("mongoose");
/* IMPORT de mongoose-unique-validator */
const uniqueValidator = require("mongoose-unique-validator");

/* Création du schema utilisateur */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/* Ajout du plugin pour limiter les erreur pour les paramettre unique */
userSchema.plugin(uniqueValidator);

/* EXPORT du schema utilisateur */
module.exports = mongoose.model("User", userSchema);
