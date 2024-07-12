# Sistema di Gestione Multe Autostradali

## Obiettivo del Progetto

Questo progetto ha l'obiettivo di realizzare un sistema backend per la gestione del calcolo di eventuali multe a seguito del passaggio di autoveicoli tra diversi varchi autostradali, implementando diverse classi di veicoli con limiti di velocità differenti. Il sistema permette di modellare le tipologie di veicolo, i varchi con posizione geografica nota, e le tratte con distanze specifiche. Inoltre, il sistema genera automaticamente infrazioni per il superamento della velocità media tra due varchi limitrofi.

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
