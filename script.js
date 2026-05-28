let jatekos = {
    eletero: 20,
    hatizsak: ["Kard", "Élelem"]
};

let aktualisFejezetId = 1;
let konyvAdatok = [];

fetch('konyv.json')
    .then(response => response.json())
    .then(data => {
        konyvAdatok = data;
        jatekInditasa();
    })
    .catch(error => {
        console.error("Hiba történt a JSON betöltésekor:", error);
        document.getElementById('story-text').innerText = "Beolvasás sikertelen. Kérlek indítsd el a Live Servert!";
    });
    
function jatekInditasa() {
    aktualisFejezetId = 1;
    jatekos.eletero = 20;
    jatekos.hatizsak = ["Kard", "Élelem"];
    megjelenitFejezet(aktualisFejezetId);
}
