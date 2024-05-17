import { connectToDatabase } from "../db/mysql.mjs";
import jwt from "jsonwebtoken";
import express from "express";
import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";
import { Console } from "console";

//Prend le répertoire courant et permet d'utilisser dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Chemin de la public key
const publicKeyPath = path.join(__dirname, '../keys/privkey.pem');

//Lecture du fichier
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

//Permet de pouvoir utiliser les routes d'express
const routeAdmin = express.Router();

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


// Passerelle pour vérifie si admin ou non
 const verifyAdmin = async (req, res, next) => {
    //Connexion à la db via notre methode de connexion
    try {
        req.dbConnection = await connectToDatabase();
        const queryString = 'SELECT isAdmin FROM t_users WHERE useName = ?';
        const [data] = await req.dbConnection.execute(queryString, [req.user.username]);
        if (data.length > 0 && data[0].isAdmin == 1) {
            // Passe la main a la route afin que la prochaine puisse s'éxecuter
            console.log("Admin vérifie")
            next();
            //Message d'erreur
        } else {
            res.status(403).json({ error: "Accès refusé, vous devez etre un admin" });
        }
        // Message d'erreur 500
    } catch (error) {
        res.status(500).json({ error: "Erreur Interne du serveur (VerifyAdmin)" });
    }
}

//Page Admin, affichage tout les users
routeAdmin.get('/', verificationJWT, verifyAdmin, async (req, res) => {
    try {
        //Récuperation des users dans la db
        req.dbConnection = await connectToDatabase();
        const queryString = 'SELECT useName FROM t_users';
        const [data] = await req.dbConnection.execute(queryString);

        //Stock les username pour chaque user dans notre tableau
        const usernames = data.map(user => user.useName);
        res.json({ users: usernames });
    } catch (error) {
        res.status(500).json({ error: "Erreur interne du serveur (Get)"});
    }
});

export default routeAdmin;