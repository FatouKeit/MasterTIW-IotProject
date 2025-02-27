const { SerialPort, ReadlineParser } = require('serialport');

const port = new SerialPort({
    path: 'COM4',
    baudRate: 9600
});

const parser = new ReadlineParser();
port.pipe(parser);

const codeCorrect = 3;
let attenteAppuis = false;

parser.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`Données reçues : ${message}`);

    if (!isNaN(message)) {
        const luminosite = parseInt(message, 10);

        if (luminosite < 100 && !attenteAppuis) {
            console.log("⚠️ Baisse de luminosité détectée, allumage du feu orange...");
            port.write("LED_ORANGE_ON\n"); // Envoi de la commande à l’Arduino
            attenteAppuis = true;

            setTimeout(() => {
                console.log("⏳ Fin des 10 secondes, vérification du code...");

                port.write("CHECK_CODE\n"); // Demande à l'Arduino de vérifier le code
                attenteAppuis = false;
            }, 10000);
        }
    } else if (message === "CODE_CORRECT") {
        console.log("✅ Code correct ! LED VERTE CLIGNOTANTE.");
    } else if (message === "CODE_INCORRECT") {
        console.log("❌ Code incorrect ! LED ROUGE CLIGNOTANTE.");
    }
});
