/* Ce fichier contient la logique métier pour les sauces */

/* --- IMPORT --- */
/* model sauces */
const Sauce = require("../models/sauce");

/* --- CONTROLLERS --- */
/* Création de sauce */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  /* céation d'une nouvelle instance de l'objet Sauce en lui passant un objet JS */
  const sauce = new Sauce({
    /* on utlise l'opérateur spread ... pour faire une copie de tous les élements req.body */
    ...sauceObject,
    /* configuration de l'url de l'image */
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  /* Vérification de l'authentification de l'utilisateur avant enregistrement de la nouvelle sauce dans la base de donnée */
  if (sauce.userId === req.auth.userId) {
    sauce
      .save()
      .then((sauce) => res.status(201).json({ message: "Sauce enregistrée!" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(403).json({ error: "Création non autorisée !" });
  }
};

/* transmettre toutes les sources */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/* transmettre une sauce */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
