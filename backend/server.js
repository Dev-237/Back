const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const filePath = path.join(__dirname, 'emails.json');

// Fonction pour enregistrer un email
function saveEmail(email) {
    let data = [];

    // Charger les emails existants
    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath));
    }

    // Éviter les doublons
    const emailExists = data.some(entry => entry.email === email);
    if (!emailExists) {
        data.push({ email, date: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
}

// API : Enregistrement email
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Adresse email invalide.' });
    }

    saveEmail(email);
    res.json({ message: 'Merci ! Votre email a bien été enregistré.' });
});

// API : Liste des emails (interface admin)
app.get('/admin/emails', (req, res) => {
    if (!fs.existsSync(filePath)) {
        return res.json([]);
    }

    const data = JSON.parse(fs.readFileSync(filePath));
    res.json(data);
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}`);
});
