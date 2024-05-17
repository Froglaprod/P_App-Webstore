import express from "express";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../db/mysql.mjs";
import { hashPassword } from "../routes/CreateUsers.mjs";
import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";

//Prend le répertoire courant et permet d'utilisser dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Chemin de la private key
const privateKeyPath = path.join(__dirname, '../keys/privkey.pem');

//Lecture du fichier
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');

//Permet de pouvoir utiliser les routes d'express
const routeAuth = express.Router();

// Passerelle pour la connexion à la base de données
export const connectToDb = async (req, res, next) => {
    //Connexion à la db via notre methode de connexion
    try {
        req.dbConnection = await connectToDatabase();
        // Passe la main a la route afin que la prochaine puisse s'éxecuter
        next();
        // Message d'erreur 500
    } catch (error) {
        res.status(500).json({ error: "Erreur Interne du serveur" });
    }
}

///Système d'authentification + génération du jeton
routeAuth.post('/', connectToDb, async (req, res) => {
    const { username, password } = req.body;

    //Récupérer l'utilisateur et le mot de passe haché avec le sel
    const queryString = 'SELECT * FROM t_users WHERE useName = ?';

    try {
        const [data] = await req.dbConnection.execute(queryString, [username]);

        //Vérifie que l'utilisateur à entrer une valeurr
        if (data.length > 0) {

            //Données de la db
            const user = data[0];

            //Hache le mot de pase entré avec le sel
            const hashedPassword = hashPassword(password, user.salt);

            //Vérification du mot de passe
            if (user.usePassword === hashedPassword) {
                // Signer et renvoye le token
                const token = jwt.sign({ username: username }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '1h' });
                res.status(200).json({ token: token });
            }
            else {
                res.status(401).json({ error: "Utilisateur ou mot de passe inccorect" });
            }
        }

        else {
            res.status(401).json({ error: "Veuillez entrer un utilisateur et un mot de passe" });
        }

    } catch (error) {
        console.error("Erreur de connexion:", error);
        res.status(500).json({ error: "Erreur Interne du serveur" });
    }
});

export default routeAuth;