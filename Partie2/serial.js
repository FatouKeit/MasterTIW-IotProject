const { SerialPort } = require('serialport'); 


const port = new SerialPort({
    path: 'COM4', 
    baudRate: 9600
});


port.on('open', () => {
    console.log('Port série ouvert');
});


port.on('data', (data) => {
    const luminosite = parseInt(data.toString().trim(), 10); // Convertir les données reçues en nombre

    console.log(`Luminosité reçue : ${luminosite}`);

    if (!isNaN(luminosite)) { // Vérifier si c'est bien un nombre
        if (luminosite > 0) {
            port.write('ON\n'); // Envoyer la consigne d'allumer la LED
            console.log('LED ON');
        } else {
            port.write('OFF\n'); // Envoyer la consigne d'éteindre la LED
            console.log('LED OFF');
        }
    } else {
        console.log('Valeur reçue invalide');
    }
});
