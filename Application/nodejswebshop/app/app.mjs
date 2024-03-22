import express from "express";


const app = express();
const port = 8080;

app.get("/", (req, res) => {
    res.send("Bienvenue sur le site web")
})


// Démarrage du serveur
app.listen(port, () => {
    console.log(`Le site web tourne sur le port http://localhost:${port}`);
});