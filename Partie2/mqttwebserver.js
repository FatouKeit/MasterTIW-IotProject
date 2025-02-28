const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');
const mqtt = require('mqtt');

const app = express();
const port = 3000;

// Connexion au serveur MQTT
const client = mqtt.connect('mqtt://localhost:1884');  // Assurez-vous que le port est correct

// Configuration du port série pour communiquer avec l'Arduino
const serialPort = new SerialPort({
    path: 'COM4',  // Remplacez avec le port correct
    baudRate: 9600
});

const parser = new ReadlineParser();
serialPort.pipe(parser);

let dataFromSerialPort = "";
let enteredCode = [];

// Codes corrects
const codesCorrects = {
    "1234": "Fatou",
    "5678": "Yannick"
};

// Gestion des données reçues du port série
parser.on('data', (data) => {
    dataFromSerialPort = data.toString().trim();

    if (dataFromSerialPort.startsWith("BOUTON_")) {
        enteredCode.push(dataFromSerialPort.replace("BOUTON_", ""));
        if (enteredCode.length === 4) {
            const code = enteredCode.join('');
            if (codesCorrects[code]) {
                console.log(`✅ Code correct. Personne détectée : ${codesCorrects[code]}`);
                enteredCode = [];
            } else {
                console.log("❌ Code incorrect.");
                enteredCode = [];
            }
        }
    }

    // Publier les données sur MQTT
    if (dataFromSerialPort) {
        client.publish('properties/detection', dataFromSerialPort, (err) => {
            if (err) {
                console.log('❌ Erreur de publication sur MQTT :', err);
            } else {
                console.log(` ${dataFromSerialPort}`);
            }
        });
    }
});

// Connexion au serveur MQTT
client.on('connect', () => {
    console.log("✅ Connecté au serveur MQTT");

    client.subscribe("properties/#", (err) => {
        if (!err) {
            console.log("✅ Abonné à Détection");
            console.log("✅ Abonné à Code Entré");
            console.log("✅ Abonné à Alarme");
        } else {
            console.log("❌ Erreur d'abonnement :", err);
        }
    });
});

// Routes Express pour récupérer les données
app.use(express.static('public'));

app.get('/data', (req, res) => {
    res.json({ data: dataFromSerialPort });
});

// Route pour ouvrir la porte
app.post('/ouvrirPorte', (req, res) => {
    serialPort.write('OUVRIR_PORTE\n', (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de communication avec Arduino' });
        }
        res.json({ message: 'Porte ouverte' });
    });
});

// Route pour arrêter l'alarme
app.post('/arreterAlarme', (req, res) => {
    serialPort.write('ARRETER_ALARME\n', (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de communication avec Arduino' });
        }
        res.json({ message: 'Alarme arrêtée' });
    });
});

// Lancer le serveur web
app.listen(port, () => {
    console.log(`✅ Webserver en écoute sur http://localhost:${port}`);
});
