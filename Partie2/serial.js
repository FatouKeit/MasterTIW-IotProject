const { SerialPort, ReadlineParser } = require('serialport');

const port = new SerialPort({
    path: 'COM4',   // Remplace par ton port série correct
    baudRate: 9600
});

const parser = new ReadlineParser();
port.pipe(parser);

const codeCorrect = 3;  // Nombre d’appuis requis sur le bouton
let attenteAppuis = false;

parser.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Données reçues : ${message}`);

    if (!isNaN(message)) {
        const luminosite = parseInt(message, 10);

        if (luminosite > 50 && !attenteAppuis) {
            console.log("⚠️ Baisse de luminosité détectée, allumage de la LED...");
            port.write("LED_ON\n"); // Envoi de la commande à l’Arduino
            attenteAppuis = true;

            setTimeout(() => {
                console.log("⏳ Fin des 10 secondes, vérification du code...");

                port.write("CHECK_CODE\n"); // Demande à l'Arduino de vérifier le code
                attenteAppuis = false;
            }, 10000);
        }
    } else if (message === "CODE_CORRECT") {
        console.log("✅ Code correct ! La LED reste allumée 3 secondes.");
    } else if (message === "CODE_INCORRECT") {
        console.log("❌ Code incorrect ! La LED clignote.");
    }
});
