import jwt from "jsonwebtoken";
import express from "express";

//Permet de pouvoir utiliser les routes d'express
const routeProfil = express.Router();

//Vérifie si le jeton est bien celui de l'utilisateur
const verificationJWT = (req, res, next) => {

    //Récupère le jeton de l'utilisateur
    const tokenUser = req.headers.authorization;

    //Vérifie si il y a un jeton
    if (tokenUser) {
        //Vérifie le jeton avec la clé publique
        jwt.verify(tokenUser, PUBLIC_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: "Erreur de jeton" });
            }
            //Jeton validé
            else {
                //Transmet les infos du jeton dans l'utilisateur
                req.user = decoded;
                // Passe la main à la route suivante
                next();
            }
        });
    } else {
        res.status(401).json({ error: "Token manquant" });
    }

};

// Permet d'accéder au profil de l'utilisateur
routeProfil.get('/', verificationJWT, (req, res) => {
    res.json({ message: "Bienvenue sur votre profil, " + req.user.username });
});

export default routeProfil;
