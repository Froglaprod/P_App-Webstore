import jwt from "jsonwebtoken";
import express from "express";
import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";

//Prend le répertoire courant et permet d'utilisser dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Chemin de la public key
const publicKeyPath = path.join(__dirname, '../keys/privkey.pem');

//Lecture du fichier
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

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

//Permet d'accéder au profil de l'utilisateur
routeProfil.get('/:name', verificationJWT, (req, res) => {
    const usernameVerification = req.params.name;

    //Vérifie nom user == jeton fourni
    if (req.user.username === usernameVerification) {
        res.json({ message: "Bienvenue sur votre profil, " + req.user.username });
    } else {
        res.status(403).json({ error: "Accès refusé, vous n'avez pas les autorisation nécessaire" });
    }
});

export default routeProfil;
