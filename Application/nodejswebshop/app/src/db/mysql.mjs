import mysql from "mysql2/promise";

// Informations de connexion pour la db
const dbConfig = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'db_authentication'
}

// Connexion a la base de données
export const connexion = await mysql.