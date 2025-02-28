const int capteurLumiere = A3;
const int ledOrange = 5;
const int ledRouge = 6;
const int ledVerte = 7;
const int buzzer = 8;    // 🛑 Buzzer ajouté (D8)
const int bouton1 = 2;   // Bouton 1 (D2)
const int bouton2 = 3;   // Bouton 2 (D3)
const int ventINA = 9;   // Ventilateur sens horaire (D9)
const int ventINB = 10;  // Ventilateur sens antihoraire (D10)

const int codeCorrect1[4] = {1, 2, 2, 1}; 
const int codeCorrect2[4] = {2, 2, 1, 1}; 
int codeUtilisateur[4] = {0, 0, 0, 0};
int appuis = 0;
bool attenteAppuis = false;

void setup() {
    pinMode(ledOrange, OUTPUT);
    pinMode(ledRouge, OUTPUT);
    pinMode(ledVerte, OUTPUT);
    pinMode(buzzer, OUTPUT);
    pinMode(ventINA, OUTPUT);
    pinMode(ventINB, OUTPUT);
    pinMode(bouton1, INPUT_PULLUP);
    pinMode(bouton2, INPUT_PULLUP);

    Serial.begin(9600);
}

void loop() {
    int valeurLumiere = analogRead(capteurLumiere);

    // Si la luminosité est faible, déclencher la détection
    if (valeurLumiere < 100 && !attenteAppuis) {
        digitalWrite(ledOrange, HIGH);
        Serial.println("Personne détectée...");
        attenteAppuis = true;
        appuis = 0;

        unsigned long debut = millis();
        while (millis() - debut < 10000 && appuis < 4) {
            if (digitalRead(bouton1) == LOW) {
                codeUtilisateur[appuis] = 1;
                appuis++;
                Serial.println("Bouton pressé : 1");
                while (digitalRead(bouton1) == LOW);
                delay(300);
            }
            if (digitalRead(bouton2) == LOW) {
                codeUtilisateur[appuis] = 2;
                appuis++;
                Serial.println("Bouton pressé : 2");
                while (digitalRead(bouton2) == LOW);
                delay(300);
            }
        }
        digitalWrite(ledOrange, LOW);

        bool correct1 = true;
        bool correct2 = true;
        for (int i = 0; i < 4; i++) {
            if (codeUtilisateur[i] != codeCorrect1[i]) correct1 = false;
            if (codeUtilisateur[i] != codeCorrect2[i]) correct2 = false;
        }

        if (correct1 || correct2) {
            String nomPersonne = "";

            if (correct1) {
                nomPersonne = "Fatou";
            } else if (correct2) {
                nomPersonne = "Yannick";
            }

            Serial.println("Code correct");
            Serial.println("Personne : " + nomPersonne);
            Serial.println("Porte : Ouverte");

            for (int i = 0; i < 6; i++) {
                digitalWrite(ledVerte, HIGH);
                digitalWrite(ventINA, HIGH);
                digitalWrite(ventINB, LOW);
                delay(600);
                digitalWrite(ledVerte, LOW);
            }
            
            digitalWrite(ventINA, LOW);
            digitalWrite(ventINB, LOW);
            delay(3000);

            Serial.println("Porte : Fermée");
            for (int i = 0; i < 6; i++) {
                digitalWrite(ventINA, LOW);
                delay(500);
                digitalWrite(ventINB, HIGH);
                delay(300);
            }

            digitalWrite(ventINA, LOW);
            digitalWrite(ventINB, LOW);
        } else {
            Serial.println("Code incorrect");
            Serial.println("Alarme activée");
            for (int i = 0; i < 6; i++) {
                digitalWrite(ledRouge, HIGH);
                digitalWrite(buzzer, HIGH);
                delay(30000);
                
            }
        }

        digitalWrite(ledVerte, LOW);
        digitalWrite(ledRouge, LOW);
        attenteAppuis = false;
    }

    // Écouter les commandes série envoyées par Express
    if (Serial.available()) {
        String command = Serial.readStringUntil('\n');
        if (command == "OUVRIR_PORTE") {
            Serial.println("Porte ouverte");
            for (int i = 0; i < 6; i++) {
                digitalWrite(ledVerte, HIGH);
                digitalWrite(ventINA, HIGH);
                digitalWrite(ventINB, LOW);
                delay(600);
                digitalWrite(ledVerte, LOW);
            }
            
            digitalWrite(ventINA, LOW);
            digitalWrite(ventINB, LOW);
            delay(3000);
        } else if (command == "ARRETER_ALARME") {
            
            digitalWrite(ledRouge, LOW);
                digitalWrite(buzzer, LOW);
                Serial.println("Alarme arrêtée");
                
        }
    }

    delay(500);
}
