import express from "express";
import routeAuth from "./src/auth/Auth.mjs";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
    res.send("Bienvenue sur le site web")
})

// Middleware pour la lecture des réponses formatées en json
app.use(express.json());

// Les routes
app.use('/auth', routeAuth);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Le site web tourne sur le port http://localhost:${port}`);
});