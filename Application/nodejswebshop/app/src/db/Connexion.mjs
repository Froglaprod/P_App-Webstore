import { connectToDatabase } from "../db/mysql.mjs";

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

