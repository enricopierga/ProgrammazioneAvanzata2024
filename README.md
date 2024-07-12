# Sistema di Gestione Multe Autostradali

## Obiettivo del Progetto

Il progetto ha l'obiettivo di sviluppare un sistema backend per la gestione delle multe derivanti dal superamento dei limiti di velocità su tratte autostradali. Questo sistema modella diverse entità chiave:

- **Tipologie di Veicoli:** Ogni tipologia di veicolo ha limiti di velocità differenti (es. auto, camion).
- **Varchi Autostradali:** Punti di controllo con posizione geografica nota.
- **Tratte:** Percorsi definiti tra un varco di inizio e un varco di fine con una distanza specifica.

### Funzionalità Principali

1. **Gestione dei Varchi:** CRUD (Create, Read, Update, Delete) per aggiungere, visualizzare, modificare e rimuovere varchi autostradali.
2. **Gestione delle Tratte:** CRUD per gestire tratte che collegano due varchi, includendo la distanza tra essi.
3. **Gestione dei Veicoli:** CRUD per gestire le informazioni sui veicoli, inclusa la loro targa e tipologia.
4. **Registrazione dei Transiti:** Inserimento dei transiti con informazioni su data, ora, targa del veicolo, tratta percorsa e condizioni meteorologiche (pioggia o sereno).
5. **Generazione Automatica delle Multe:** Calcolo automatico delle infrazioni basato sulla velocità media del veicolo tra due varchi e le condizioni meteorologiche.
6. **Query sulle Multe:** Recupero delle multe in base a targa e periodo, con dettagli sul varco di inizio, varco di fine, velocità media, differenza rispetto al limite, e condizioni meteorologiche.
7. **Generazione di Bollettini di Pagamento:** Creazione di bollettini di pagamento in formato PDF, includendo un QR-code con informazioni dettagliate sulla multa.
8. **Gestione dei Pagamenti:** Gestione dei crediti degli utenti e pagamento delle multe attraverso un backend separato, con funzioni per ricaricare i crediti e verificare il saldo.

Il sistema supporta tre ruoli distinti:

- **Operatore:** Ha pieno accesso alle operazioni di CRUD per varchi, tratte e veicoli, e può registrare transiti.
- **Varco:** Può registrare transiti.
- **Automobilista:** Può visualizzare solo le multe associate ai propri veicoli.

## Progettazione

### Diagrammi UML

#### Diagramma delle Classi

![Class Diagram](path_to_class_diagram.png)

#### Diagramma dei Casi d'Uso

![Use Case Diagram](path_to_use_case_diagram.png)

### Pattern Utilizzati

#### MVC (Model-View-Controller)
Il pattern MVC è stato scelto per separare la logica di business dalla presentazione e dalla gestione delle richieste. Questo permette di mantenere il codice modulare e facilmente manutenibile. La struttura del progetto è suddivisa in tre componenti principali:
- **Model:** Gestisce la logica dei dati e l'interazione con il database tramite Sequelize.
- **View:** (Non applicabile in questo backend puro)
- **Controller:** Gestisce la logica di controllo e risponde alle richieste HTTP.

#### Repository Pattern
Il Repository Pattern è stato utilizzato per astrarre la logica di accesso ai dati, fornendo una chiara separazione tra la logica di business e la logica di accesso ai dati. Questo rende il codice più testabile e manutenibile.

## Avviare il Progetto

### Prerequisiti

- Docker
- Docker Compose

### Istruzioni

1. Clonare il repository:
    ```bash
    git clone https://github.com/username/repository.git
    cd repository
    ```

2. Configurare le variabili d'ambiente:
    Creare un file `.env` nella radice del progetto e configurare le seguenti variabili:
    ```
    DB_USER=myuser
    DB_PASSWORD=mypassword
    DB_NAME=mydatabase
    DB_HOST=db
    DB_PORT=5432
    ```

3. Avviare i servizi con Docker Compose:
    ```bash
    docker-compose up --build
    ```

4. Accedere ai servizi:
    - Backend Transiti: `http://localhost:3000`
    - Backend Pagamenti: `http://localhost:3001`

## Test del Progetto

### Postman

È possibile testare il progetto utilizzando Postman. Forniamo una collection Postman che contiene tutte le richieste necessarie per testare le API. Importare la collection in Postman e seguire le istruzioni per testare le diverse rotte.

[Scarica la Collection Postman](path_to_postman_collection.json)

### Esempi di Richieste

#### CRUD per la Gestione dei Varchi
- **POST /gates**
    ```json
    {
      "location": "Location 1"
    }
    ```
- **GET /gates**
- **GET /gates/:id**
- **PUT /gates/:id**
    ```json
    {
      "location": "New Location"
    }
    ```
- **DELETE /gates/:id**

#### CRUD per la Gestione delle Tratte
- **POST /routes**
    ```json
    {
      "startGateId": 1,
      "endGateId": 2,
      "distance": 50
    }
    ```
- **GET /routes**
- **GET /routes/:id**
- **PUT /routes/:id**
    ```json
    {
      "startGateId": 1,
      "endGateId": 3,
      "distance": 55
    }
    ```
- **DELETE /routes/:id**

#### CRUD per la Gestione dei Veicoli
- **POST /vehicles**
    ```json
    {
      "licensePlate": "AB123CD",
      "type": "car"
    }
    ```
- **GET /vehicles**
- **GET /vehicles/:id**
- **PUT /vehicles/:id**
    ```json
    {
      "licensePlate": "AB123CD",
      "type": "truck"
    }
    ```
- **DELETE /vehicles/:id**

#### Inserimento Transiti e Generazione Multe
- **POST /transits**
    ```json
    {
      "vehicleId": 1,
      "routeId": 1,
      "travelTime": 3600,
      "weather": "clear"
    }
    ```

#### Richiesta Multe per Targa e Periodo
- **POST /infractions/query**
    ```json
    {
      "plates": ["AB123CD", "EF456GH"],
      "startDate": "2023-01-01",
      "endDate": "2023-12-31"
    }
    ```

#### Scaricare Bollettino di Pagamento
- **GET /payments/:id/pdf**

#### Effettuare un Pagamento
- **POST /payments**
    ```json
    {
      "paymentUuid": "6836178f-0c79-4c10-88ec-75bae54fd6a4",
      "amount": 150
    }
    ```

### Conclusione

Questo progetto implementa un sistema completo per la gestione delle multe autostradali con ruoli differenziati, utilizzando pattern architetturali solidi e tecnologie moderne. Seguire le istruzioni per avviare e testare il sistema e garantire la corretta configurazione delle variabili d'ambiente e dei servizi Docker.
