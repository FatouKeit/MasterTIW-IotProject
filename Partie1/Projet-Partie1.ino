/*
  Blink

  Turns an LED on for one second, then off for one second, repeatedly.

  Most Arduinos have an on-board LED you can control. On the UNO, MEGA and ZERO
  it is attached to digital pin 13, on MKR1000 on pin 6. LED_BUILTIN is set to
  the correct LED pin independent of which board is used.
  If you want to know what pin the on-board LED is connected to on your Arduino
  model, check the Technical Specs of your board at:
  https://www.arduino.cc/en/Main/Products

  modified 8 May 2014
  by Scott Fitzgerald
  modified 2 Sep 2016
  by Arturo Guadalupi
  modified 8 Sep 2016
  by Colby Newman

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/Blink
*/

const int ledJaune = 2;
const int capteurLDR = A3;
const int seuil = 85;
// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(ledJaune, OUTPUT);
  Serial.begin(9600);
}

// the loop function runs over and over again forever
void loop() {
  int valeurLumiere = analogRead(capteurLDR);
  Serial.println("Luminisité :");
  Serial.println(valeurLumiere); //envoyer valeurLumiere vers le port serial
  
  if (valeurLumiere > seuil){
    digitalWrite(ledJaune, HIGH);
  } else {
    digitalWrite(ledJaune, LOW);
  }
  
  // turn the LED on (HIGH is the voltage level)
  delay(200);                       // wait for a second
}
