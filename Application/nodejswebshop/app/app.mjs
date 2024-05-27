import express from "express";
import routeAuth from "./src/routes/Auth.mjs";
import routeCreateUser from "./src/routes/CreateUsers.mjs";
import routeProfil from "./src/routes/UsersProfil.mjs";
import routeAdmin from "./src/routes/Admin.mjs";
import https from "https";
import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";

//Prend le répertoire courant et permet d'utilisser dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Chemin du certificat
const certificatPath = path.join(__dirname, '/src/keys/server.crt');
//Chemin de la private key
const privateKeyPath = path.join(__dirname, '/src/keys/privkey.pem');

//Lecture du fichier
const CERTIFICAT = fs.readFileSync(certificatPath, 'utf8');
//Lecture du fichier 
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');

const app = express();
const port = 443;

app.get("/", (req, res) => {
    res.send("Bienvenue sur le site web")
})

// Middleware pour la lecture des réponses formatées en json
app.use(express.json());

// Les routes
app.use('/login', routeAuth);
app.use('/create', routeCreateUser);
app.use('/users', routeProfil);
app.use('/admin', routeAdmin);

//Creation server https
const server = https.createServer({
    key: PRIVATE_KEY,
    cert: CERTIFICAT
}, app);

// Démarrage du serveur
server.listen(port, () => {
    console.log(`Le site web tourne sur le port https://localhost:${port}`);
});