# Sports_complex_projekt

author: "Karina Piir, Anastasia Baumer"
---

# Sportkompleksi Veebirakendus: Arendusprojekt

---

## 1. Sissejuhatus

### Projekti Kirjeldus
Veebipõhine süsteem, mis on loodud spordisaalide ja treeningute efektiivseks haldamiseks ja broneerimiseks. See projekt loob digitaalse lahenduse, mis muudab spordikompleksi haldamise lihtsamaks nii töötajate kui ka klientide jaoks.

### Eesmärgid
* **Lihtsustada haldust:** Administraator saab kiiresti hallata saale, treenereid ja kasutajaid.
* **Automatiseerida broneeringud:** Kliendid saavad ise valida aja ja saali ning broneering jõuab kohe süsteemi.
* **Parandada kliendikogemust:** Kasutajasõbralik liides, kiire navigeerimine ja mobiilne ligipääs muudavad teenuse mugavamaks ja kättesaadavamaks.

Lõpptulemusena aitab see süsteem säästa aega, vähendada vigu ja tõsta spordikeskuse efektiivsust ning rahulolu.

### Kasutatud Tehnoloogiad
* **Backend:** Node.js (Express.js)
* **Andmebaas:** PostgreSQL
* **Frontend:** React
* **Stiilimine:** Bootstrap
* **Autentimine:** JWT (JSON Web Tokens) ja bcrypt
* **Andmebaasi ORM:** Sequelize
---

## 2. Andmebaasi Arhitektuur

### Olulisemad Andmebaasi Tabelid
* **`KASUTAJA`:** Kasutaja identifitseerimine (ID), isikuandmed (nimi, e-post), roll ja krüpteeritud parool (`Salasõna`/`ParooliHash`).
* **`SAALID`:** Spordisaali andmed (nimi, kirjeldus, mahtuvus, tunnihind, pildi URL).
* **`BRONEERINGUD`:** Broneeringute üksikasjad, mis seovad saali ja kasutaja kindla ajavahemikuga.
* **`TREENER`:** Treenerite spetsiifiline profiiliinfo (nt. spetsialiseerumine, kogemused).
* **`HINNANGUD`:** Klientide antud hinnangud ja kommentaarid treeneritele või teenustele.
---

## 3. Rakenduse Käivitamine

Projekt on jaotatud kaheks osaks: backend ja frontend, mida saab käivitada eraldi terminaliakendes.

### Vajalikud Pakettide Paigaldused
Enne käivitamist veenduge, et kõik vajalikud Node.js paketid on paigaldatud.
Navigeerige mõlema projekti juurkataloogi ja käivitage:


Andmebaasi draiver PostgreSQL jaoks:

npm install pg pg-hstore

JWT ja bcrypt autentimiseks:

npm install jsonwebtoken bcryptjs

Sequelize ORM: (Eeldusel, et see on juba npm install all, kuid täpsustamiseks)

npm install sequelize

Backendi Käivitamine: avage esimene terminaliaken, navigeerige projekti backend kausta:

cd /tee/oma/projektini/backend

Käivitage server:

node index.js

Terminalis peaks ilmuma teade serveri edukast käivitamisest ja andmebaasiühendusest.

Frontendi Käivitamine: avage teine terminaliaken, navigeerige projekti frontend kausta:

cd /tee/oma/projektini/frontend

Käivitage React arendusserver:

npm run dev

Terminalis ilmub link lokaalsele hostile (http://localhost:5173/).

Avage see link oma veebibrauseris, et projekt käivitada.

4. Frontend: Peamised Komponendid ja UI Kirjeldus
Peamised Komponendid
Rakendus on ehitatud kasutades React.js teeki interaktiivse kasutajaliidese loomiseks ja Bootstrap'i, et tagada mobiilisõbralik ning kaasaegne disain.

Lehekülgede struktuur hõlmab nelja peamist avalikku vaadet ja rollipõhiseid halduslehti:

Kodu (Avaleht): Sisaldab üldist teavet ja sissejuhatust teenuse kohta.

Saalid: Võimaldab kasutajal sirvida olemasolevaid treeningsaale ja teha broneeringuid.

Treenerid: Kuvab iga treeneri profiili, spetsialiseerumist ning lisainfot.

Sisselogimine ja Registreerimine: Vaated uute kasutajakontode loomiseks ja olemasolevate sisselogimiseks.

Rollipõhine Ligipääs
Süsteemi sisselogimisel toimub kasutaja rolli kontroll:

Tavaline kasutaja: Pärast sisselogimist on kasutajale lisaks avalikele lehtedele ligipääsetav ka Minu Profiil.

Administraator: Administraatoril on olemas kõik kasutaja õigused, kuid talle avanevad ka spetsiaalsed halduslehed:

Saalide Haldus: Võimaldab saale lisada, muuta või kustutada.

Kasutajate Haldus: Võimaldab kasutajate andmeid vaadata, muuta, kustutada ja haldada nende rolle.


5. UI Kirjeldus

Täielik Responsiivsus: Kõik lehed ja elemendid kohanduvad automaatselt erinevatele ekraanisuurustele, pakkudes mugavat kasutust nii arvutites kui ka mobiilsetes seadmetes.

Lihtne ja Loogiline Navigatsioon: Ülaservas asuv menüüriba võimaldab kasutajal kiiresti liikuda näiteks kodulehelt saalide või treenerite vaatesse.

Interaktiivsus: Nupud, sisendväljad ja teated annavad kasutajale kohest visuaalset tagasisidet, näiteks roheline kinnitus edukal tegevusel või punane teade vea korral.

Kokkuvõttes on liides minimalistlik, selge ja intuitiivne, et kasutajal oleks võimalik keskenduda sisule, mitte otsimisele.


6. Backend: Tehnoloogiad ja API Struktuur
Backend on ehitatud kasutades Node.js ja Express.js raamistikku, mis võimaldab lihtsalt ja skaleeritavalt hallata serveripoolset loogikat. Andmete salvestamiseks kasutame PostgreSQL andmebaasi.

API on REST-põhine, kus iga marsruut vastab kindlale funktsioonile. Näiteks:

/auth/register ja /auth/login tegelevad kasutajate registreerimise ja sisselogimisega.

/halls marsruudil saab kasutaja vaadata saalide nimekirja, kuid ainult administraator saab uusi saale lisada.

Autentimine ja Autorisatsioon
Kasutaja autentimiseks on implementeeritud JWT (JSON Web Tokens), mis annab iga sisseloginud kasutajale unikaalse turvalise märgi.

Paroolide turvaliseks salvestamiseks kasutame bcrypt krüpteerimist.

Rollipõhine ligipääs on tagatud spetsiaalsete middleware’i abil: tavalised kasutajad pääsevad ligi ainult oma vaadetele, samas kui administraatoritele on loodud eraldi haldusmarsruudid.



7. Kokkuvõte: Tulemused, Probleemid ja Võimalikud Täiustused
Saavutused
Projekti käigus realiseeritud peamised funktsionaalsused:

Kasutajate registreerimine ja sisselogimine turvaliselt (JWT ja bcrypt).

Rollipõhine ligipääs süsteemile ja funktsioonidele.

Kasutajate, saalide ja treenerite CRUD (loomine, lugemine, uuendamine, kustutamine) operatsioonid.

Broneeringute loomine ja haldamine.

Andmete valideerimine ja veakäsitlus.

Responsiivne ja intuitiivne kasutajaliides, mis pakub mugavat kasutuskogemust.

