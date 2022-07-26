/* Ce fichier contient la logique métier pour les sauces */

/* --- IMPORT --- */
/* model sauces */
const Sauce = require("../models/sauce");
/* package 'file system' */
const fs = require("fs");

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
      .catch((error) => res.status(403).json({ error }));
  } else {
    res.status(401).json({ error: "Création non autorisée !" });
  }
};

/* transmettre toutes les sources */
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

/* transmettre une sauce */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/* supprimer une sauce */
exports.deleteSauce = (req, res, next) => {
  /* on cherche la sauce qui a l'id correspondent à celui dans les parametres de la requete */
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      /* vérifier si on trouve la sauce à supprimée */
      if (!sauce) {
        return res.status(404).json({ error: "Sauce non trouvée !" });
      }
      /* vérifier si l'userId de la sauce est le même que l'userId authentifié */
      // if (sauce.userId && sauce.userId !== req.auth.userId) {
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({ error: "Requête non autorisée !" });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      /* la methode fs.unlink va supprimer l'image du chemin local et dans la base de donnée */
      /* 1er arg: chemin du fichier, 
            2e arg: la callback = ce qu'il faut faire une fois le fichier supprimé */
      fs.unlink(`images/${filename}`, () => {
        /* on supprime la sauce de la base de donnée en indiquant son id */
        /* pas besoin de 2e arg car suppression */
        Sauce.deleteOne({ _id: req.params.id })
          .then((Sauce) =>
            res.status(200).json({ message: "Sauce supprimée !" })
          )
          .catch((error) => res.status(403).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

/* modification d'une sauce */
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    /* stockage des modification de la sauce */
    const sauceObject = req.file
      ? /* vérification de l'ajout d'un fichier image dans la requête */
        {
          /* Si le fichier image existe, on traite les strings et la nouvelle image */
          ...JSON.parse(req.body.sauce),
          /* on modifie l'url de l'image */
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : /* si pas de fichier image, on traite les autres élements du corps de la requête */
        { ...req.body };

    /* Si l'userId de la sauce modifiée est le même que l'userId de la sauce avant modification */
    if (sauceObject.userId && sauceObject.userId !== sauce.userId) {
      res.status(401).json({ error: "Modification non autorisée !" });
    }

    if (!sauce) {
      return res.status(404).json({ error: "Sauce non trouvée !" });
    }

    /* suppresion de l'image modifié de notre dossier d'images */
    if (req.file) {
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (error) => {
            if (error) {
              throw new Error(error);
            }
          });
        })
        .catch((error) => res.status(400).json({ error: error.message }));
    }

    /* modification de la sauce */
    Sauce.updateOne(
      /* 1er argument : la sauce à modifier */
      /* 2ème argument : la version modifié de la sauce, celle envoyée dans la requête */
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then((sauce) =>
        res.status(200).json({ message: "Sauce bien modifiée !" })
      )
      .catch((error) => res.status(400).json(error));
  });
};

/* like et dislike une sauce */
exports.likeASauce = (req, res, next) => {
  /* trouver la sauce dans la base des données */
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      /* récupérer les valeurs de likes et dislikes */
      const userStatus = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };

      /* gestion des cas selon la valeur de "like" */
      switch (req.body.like) {
        /* si req.body.like = 1, l'utilisateur aime la sauce */
        case 1:
          /* ...et qu'il n'a pas encore liké */
          if (!userStatus.usersLiked.includes(req.body.userId)) {
            userStatus.usersLiked.push(
              req.body.userId
            ); /* ajouter dans le tableau "userLiked" */
          } else {
            /* ...et qu'il a déjà liké */
            throw new Error("Un seul like possible !");
          }
          /* ... et qu'il a déjà disliké */
          if (userStatus.usersDisliked.includes(req.body.userId)) {
            throw new Error("Merci d'annuler votre dislike avant de liker !");
          }
          break;

        /* si req.body.like = -1, l'utilisateur n'aime pas la sauce */
        case -1:
          /* ...et qu'il n'a pas encore disliké */
          if (!userStatus.usersDisliked.includes(req.body.userId)) {
            userStatus.usersDisliked.push(
              req.body.userId
            ); /* ajouter dans le tableau "userDisliked" */
          } else {
            /* ...et qu'il a déjà disliké */
            throw new Error("Un seul dislike possible !");
          }
          /* ...et qu'il a déjà liké */
          if (userStatus.usersLiked.includes(req.body.userId)) {
            throw new Error("Merci d'annuler votre like avant de disliker !");
          }
          break;

        /* si req.body.like = 0, l'utilisateur annule son like ou dislike ou neutre */
        case 0:
          /* si l'utilisateur a déjà liké, retirer-le du tableau "userLiked" */
          if (userStatus.usersLiked.includes(req.body.userId)) {
            let indexLiked = userStatus.usersLiked.indexOf(
              req.body.userId
            ); /* indexer l'userID */
            userStatus.usersLiked.splice(
              indexLiked,
              1
            ); /* supprimer 1 élément à partir de l'index "index" */
          } else if (userStatus.usersDisliked.includes(req.body.userId)) {
          /* si l'utilise a déjà disliké, retirer-le du tableau "userDisliked" */
            let indexDisliked = userStatus.usersDisliked.indexOf(
              req.body.userId
            );
            userStatus.usersDisliked.splice(indexDisliked, 1);
          }
          break;

        default:
          throw error;
      }

      /* calculer le nombre total de likes et dislikes */
      userStatus.likes = userStatus.usersLiked.length;
      userStatus.dislikes = userStatus.usersDisliked.length;

      /* mettre à jour la sauce avec les nouveaux status */
      Sauce.updateOne({ _id: req.params.id }, userStatus)
        .then((sauce) => res.status(200).json({ message: "Sauce bien notée!" }))
        .catch((error) => res.status(400).json({ error: error.message }));
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};
