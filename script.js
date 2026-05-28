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


function megjelenitFejezet(fejezetId) {
    document.getElementById('hp-display').innerText = jatekos.eletero;
    document.getElementById('inventory-display').innerText = jatekos.hatizsak.join(', ');

    let fejezet = konyvAdatok.find(f => f.id === fejezetId);

    if (!fejezet) {
        document.getElementById('story-text').innerText = "A fejezet nem található a rendszerben.";
        return;
    }

    document.getElementById('chapter-id').innerText = fejezetId + ". Pont";
    document.getElementById('story-text').innerText = fejezet.szoveg;

    if (fejezet.targy && fejezetId !== 10 && !jatekos.hatizsak.includes(fejezet.targy)) {
        jatekos.hatizsak.push(fejezet.targy);
        document.getElementById('inventory-display').innerText = jatekos.hatizsak.join(', ');
    }


    if (fejezet.sebzes) {
        jatekos.eletero -= fejezet.sebzes;
        if (jatekos.eletero < 0) jatekos.eletero = 0;
        document.getElementById('hp-display').innerText = jatekos.eletero;
    }
    
    if (fejezet.sebzes_pajzs_nelkul && !jatekos.hatizsak.includes("Pajzs")) {
        jatekos.eletero -= fejezet.sebzes_pajzs_nelkul;
        if (jatekos.eletero < 0) jatekos.eletero = 0;
        document.getElementById('hp-display').innerText = jatekos.eletero;
    }

    let gombokContainer = document.getElementById('choices-container');
    gombokContainer.innerHTML = '';

    if (jatekos.eletero <= 0 || fejezet.halal) {
        document.getElementById('story-text').innerText += "\n\nSajnálatos módon az életpontjaid elfogytak, vagy halálos csapdába estél. A kalandod itt véget ért.";
        ujrainditasGomb();
        return;
    }


    if (fejezet.gyozelem) {
        ujrainditasGomb();
        return;
    }
    fejezet.opciok.forEach(opcio => {

        if (fejezet.kulcs_szukseges && opcio.kovetkezo === 44 && !jatekos.hatizsak.includes("Kapu kulcs")) {
            return;
        }
        if (fejezet.kulcs_szukseges && opcio.kovetkezo === 278 && jatekos.hatizsak.includes("Kapu kulcs")) {
            return;
        }

        if (fejezet.terkep_szukseges && opcio.kovetkezo === 400 && !jatekos.hatizsak.includes("Térkép darab")) {
            return; 
        }
        if (fejezet.terkep_szukseges && opcio.kovetkezo === 399 && jatekos.hatizsak.includes("Térkép darab")) {
            return; 
        }

        let gomb = document.createElement('button');
        gomb.className = 'choice-btn';
        gomb.innerText = opcio.szoveg;
        
        gomb.onclick = () => {
            if (fejezetId === 10 && opcio.szoveg.includes("Zsebre vágom")) {
                if (!jatekos.hatizsak.includes(fejezet.targy)) {
                    jatekos.hatizsak.push(fejezet.targy);
                }
            }
            megjelenitFejezet(opcio.kovetkezo);
        };
        
        gombokContainer.appendChild(gomb);
    });
}