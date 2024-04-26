import express from "express";
import jwt from "jsonwebtoken";
import SECRET_KEY from "../db/Secret_key.mjs";
import { connectToDatabase } from "../db/mysql.mjs";


//Permet de pouvoir utiliser les routes d'express
const routeAuth = express.Router();

// Passerelle pour la connexion à la base de données
const connectToDb = async (req, res, next) => {
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

//Système d'authentification + génération du jeton
routeAuth.post('/', connectToDb, async (req, res) => {
    const { username, password } = req.body;

    const queryString = 'SELECT * FROM t_users WHERE useFirst_Name = ? AND usePassword = ?';

    //Connexion
    try {
        const [data] = await req.dbConnection.execute(queryString, [username, password]);
        //Vérification entrée utilisateur
        if (data.length > 0) {
            // Signe et renvoye le token
            const jeton = jwt.sign({ username: username }, SECRET_KEY, { algorithm: 'HS256', expiresIn: '1h' });

            res.status(200).json({ jeton: jeton });
        } else {
            res.status(401).json({ error: "Utilisateur ou mot de passe Invalide" });
        }
    } catch (error) {
        console.error("Erreur de connexion:", error);
        res.status(500).json({ error: "Erreur Interne du serveur" });
    }
});

export default routeAuth;