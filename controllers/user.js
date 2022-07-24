/* Ce fichier contient la logique métier pour les utilisateurs */

/* --- IMPORT --- */
/* package 'bcrypt' */
const bcrypt = require("bcrypt");
/* package 'jsonwebtoken' */
const jwt = require("jsonwebtoken");
/* model utilisateur */
const User = require("../models/user");

/* EXPORT : Logique de métier pour l'enregistrement d'un utilisateur */
exports.signup = (req, res, next) => {
  /* Hachage du mot de passe, "salage" 10 fois */
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      /* Enregistrement du mot de passe salé */
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "Nouvelle utilisateur créé !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/* EXPORT : Logique de métier pour la connexion d'un utilisateur */
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Login ou mot de passe incorrecte !" });
      }
      /* comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données */
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Login ou mot de passe incorrecte !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
