const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json()); 


const serialPort = new SerialPort({
    path: 'COM4', 
    baudRate: 9600
});
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let luminosite = 0;
let mode = 'auto'; 


parser.on('data', (data) => {
    luminosite = parseInt(data.trim(), 10); 
    console.log(`Luminosité reçue : ${luminosite}`);

    if (mode === 'auto') { 
        if (luminosite > 30) {
            serialPort.write('ON\n');
            console.log('LED ON (Auto)');
        } else {
            serialPort.write('OFF\n');
            console.log('LED OFF (Auto)');
        }
    }
});


app.get('/luminosite', (req, res) => {
    res.send(luminosite.toString());
});


app.post('/mode', (req, res) => {
    mode = req.body.mode;
    console.log(`Mode changé en : ${mode}`);
    res.sendStatus(200);
});


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
