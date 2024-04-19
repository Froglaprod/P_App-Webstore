import mysql from "mysql2/promise";

// Informations de connexion pour la db
const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'db_authentication'
}

// Connexion a la base de données
export const connectToDatabase = async () => {
    // Essaye de se connecter
    try {
      const connection = await mysql.createConnection(dbConfig);
      console.log("Connexion à la base de données réussite");
      return connection;
      // Message d'erreur
    } catch (error) {
      console.error("Erreur de connexion à la base de données:", error);
      throw error;
    }
  };