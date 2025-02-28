/* const { SerialPort, ReadlineParser } = require('serialport');
const mqtt = require('mqtt');

const port = new SerialPort({
    path: 'COM4',
    baudRate: 9600
});

const parser = new ReadlineParser();
port.pipe(parser);

const client = mqtt.connect('mqtt://localhost:1884'); // ✅ Port MQTT correct

const codeCorrect1 = [1, 2, 2, 1];
const codeCorrect2 = [2, 2, 1, 1];
let codeUtilisateur = [];
let attenteAppuis = false;
let timer = null;

client.on('connect', () => {
    console.log('✅ Servient connecté au broker MQTT');
    client.subscribe('properties/#', (err) => {
        if (err) console.log('Erreur de subscription : ', err);
    });
    
});

parser.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`📩 Données reçues : ${message}`);
   

    if (!isNaN(message)) {
        const luminosite = parseInt(message, 10);
        if (luminosite < 100 && !attenteAppuis) {
            console.log("Envoi du message de détection...");
            client.publish("properties/detection", "Personne détectée");
            
            attenteAppuis = true;
            codeUtilisateur = [];

            timer = setTimeout(() => {
                console.log("Fin des 10 secondes, vérification du code...");
                verifierCode();
                attenteAppuis = false;
            }, 10000);
        }
    } else if (message.startsWith("BOUTON_")) {
        enregistrerAppui(message);
    }
});

function enregistrerAppui(message) {
    if (codeUtilisateur.length < 4) {
        const bouton = message === "BOUTON_1" ? 1 : 2;
        codeUtilisateur.push(bouton);
        console.log(`Appui enregistré : Bouton ${bouton} (${codeUtilisateur.length}/4)`);
        client.publish("properties/bouton_appuyer", `${bouton}`);
        
        if (codeUtilisateur.length === 4) {
            clearTimeout(timer);
            timer = null; 
            console.log("✅ 4 appuis enregistrés, vérification immédiate...");
            verifierCode();
            attenteAppuis = false;
        }
    }
}


function verifierCode() {
    const estCorrect1 = JSON.stringify(codeUtilisateur) === JSON.stringify(codeCorrect1);
    const estCorrect2 = JSON.stringify(codeUtilisateur) === JSON.stringify(codeCorrect2);

    if (estCorrect1 || estCorrect2) {
        console.log("✅ Code correct ! LED VERTE + Ventilateur en avant 3s.");
        client.publish("properties/code_entre", "Correct");
        client.publish("properties/VENTILATEUR_START", "Ouverte");
        port.write("CODE_CORRECT\n");
        client.publish("properties/VENTILATEUR_INVERSE", "Fermée");
    } else {
        console.log("❌ Code incorrect ! LED ROUGE + Buzzer 3s.");
        */
        client.publish("properties/code_entre", "Incorrect");
        client.publish("properties/Alarme", "Activée");
        port.write("CODE_INCORRECT\n");
    }
}
