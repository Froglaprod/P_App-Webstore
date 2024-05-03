import express from "express";
import crypto from "crypto";
import { connectToDb } from "../db/Connexion.mjs";

//Permet de pouvoir utiliser les routes d'express
const routeCreateUser = express.Router();

//Génération du sel en hexadécimal
const generatorSalt = () => {
const salt = crypto.randomBytes(16).toString('hex');
return salt;
}

//Hachage avec le sel le mot de passe de l'utilisateur en hexadécimal
export const hashPassword = (password, salted) => {
    return crypto.pbkdf2Sync(password, salted, 2000, 64, 'sha512').toString('hex');
}

//Système de création de l'utilisateur (Hachage mdp et génération sel)
routeCreateUser.post('/', connectToDb, async (req, res) => {
    //Récupére les donnes entrée
    const { username, password } = req.body;

    // Génération d'un sel aléatoire
    const salted = generatorSalt();

    // Hachage du mot de passe avec le sel
    const hashedPassword = hashPassword(password, salted);

    //Commande pour insert les données dans la db
    const insert = 'INSERT INTO t_users (useName, usePassword, salt) VALUES (?, ?, ?)';

    //Essaye d'insérer les données à aprtir de la commande
    try {
        await req.dbConnection.execute(insert, [username, hashedPassword, salted]);
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur Interne du serveur" });
    }
});

export default routeCreateUser;