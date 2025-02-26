const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');

const app = express();
const port = 3000;

app.use(express.static('public')); // Servir les fichiers statiques (index.html, CSS...)
app.use(express.json()); // Pour parser les requêtes JSON

// Initialisation du port série
const serialPort = new SerialPort({
    path: 'COM4', // Remplace par ton port réel (ex: COM3 sous Windows ou /dev/ttyUSB0 sous Linux)
    baudRate: 9600
});
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let luminosite = 0;
let mode = 'auto'; // Mode automatique par défaut

// Lire les données du capteur depuis l'Arduino
parser.on('data', (data) => {
    luminosite = parseInt(data.trim(), 10); // Convertir en nombre
    console.log(`Luminosité reçue : ${luminosite}`);

    if (mode === 'auto') { // Gestion automatique de la LED
        if (luminosite > 30) {
            serialPort.write('ON\n');
            console.log('LED ON (Auto)');
        } else {
            serialPort.write('OFF\n');
            console.log('LED OFF (Auto)');
        }
    }
});

// Route pour récupérer la luminosité actuelle
app.get('/luminosite', (req, res) => {
    res.send(luminosite.toString());
});

// Route pour changer le mode d'éclairage (Auto / Manuel)
app.post('/mode', (req, res) => {
    mode = req.body.mode;
    console.log(`Mode changé en : ${mode}`);
    res.sendStatus(200);
});

// Route pour contrôler la LED en mode manuel
app.post('/led', (req, res) => {
    if (mode === 'manuel') {
        const etat = req.body.etat;
        serialPort.write(`${etat}\n`);
        console.log(`LED en mode manuel : ${etat}`);
    }
    res.sendStatus(200);
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
