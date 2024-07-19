# Sistema di Gestione delle Multe Autostradali

## Indice
1. [Obiettivo del Progetto](#obiettivo-del-progetto)
2. [Progettazione](#progettazione)
    - [Diagramma dei Casi d'Uso](#diagramma-dei-casi-duso)
    - [Diagramma ER](#diagramma-er)
    - [Pattern Utilizzati](#pattern-utilizzati)
3. [Avviare il Progetto](#avviare-il-progetto)
    - [Prerequisiti](#prerequisiti)
    - [Istruzioni](#istruzioni)
4. [Test del Progetto](#test-del-progetto)
    - [Postman](#postman)
    - [Esempi di Richieste](#esempi-di-richieste)
        - [Login nel Sistema](#login-nel-sistema)
        - [Rotta protetta (decodeJWT)](#rotta-protetta-decodejwt)
        - [CRUD per la Gestione dei Varchi](#crud-per-la-gestione-dei-varchi)
        - [CRUD per la Gestione delle Tratte](#crud-per-la-gestione-delle-tratte)
        - [CRUD per la Gestione dei Veicoli](#crud-per-la-gestione-dei-veicoli)
        - [CRUD per la Gestione dei Transiti (e Generazione delle Multe)](#crud-per-la-gestione-dei-transiti-e-generazione-delle-multe)
        - [Richiesta Multe per Targa e Periodo](#richiesta-multe-per-targa-e-periodo)
        - [Ottenere il credito di un utente](#ottenere-il-credito-di-un-utente)
        - [Aggiungere il credito ad un utente](#aggiungere-il-credito-ad-un-utente)
        - [Scaricare Bollettino di Pagamento](#scaricare-bollettino-di-pagamento)
        - [Effettuare un Pagamento](#effettuare-un-pagamento)

## Obiettivo del Progetto

Il progetto ha l'obiettivo di sviluppare un sistema per la gestione delle multe derivanti dal superamento dei limiti di velocità su tratte autostradali, simile ai sistemi Tutor. Questo sistema modella diverse entità chiave:

- **Tipologie di Veicoli:** Ogni tipologia di veicolo ha limiti di velocità differenti (es. auto, camion).
- **Varchi Autostradali:** Punti di controllo con posizione geografica nota.
- **Tratte:** Percorsi definiti tra un varco di inizio e un varco di fine con una distanza specifica.

### Funzionalità Principali

1. **Gestione dei varchi:** CRUD per aggiungere, visualizzare, modificare e rimuovere varchi autostradali.
2. **Gestione delle tratte:** CRUD per gestire tratte che collegano due varchi, includendo la distanza tra essi.
3. **Gestione dei veicoli:** CRUD per gestire le informazioni sui veicoli, inclusa la loro targa e tipologia.
4. **Registrazione dei transiti:** Inserimento dei transiti con informazioni sul veicolo, tratta percorsa, tempo impiegato per percorrerla e condizioni meteorologiche (pioggia o sereno).
5. **Generazione automatica delle multe:** Calcolo automatico delle infrazioni basato sulla velocità media del veicolo tra due varchi.
6. **Query sulle multe:** Recupero delle multe in base a targa e periodo, fornendo i relativi dettagli.
7. **Generazione di bollettini di pagamento:** Creazione di bollettini di pagamento in formato PDF, includendo un QR-code con informazioni dettagliate sulla multa.
8. **Gestione dei pagamenti:** Gestione del credito degli utenti e pagamento delle multe attraverso un backend separato, con funzioni per verificare e/o verificare il creditoo.

Il sistema supporta tre ruoli distinti:

- **Operatore:** Ha pieno accesso alle operazioni di CRUD per varchi, tratte e veicoli, e può registrare transiti.
- **Varco:** Può registrare transiti.
- **Automobilista:** Può visualizzare (e pagare) solo le multe associate ai propri veicoli.

## Progettazione

### Diagramma dei Casi d'Uso

![Use Case Diagram](./diagrams/use_cases_diagram.png)

### Diagramma ER

 <p align="center">
     <img src="./diagrams/er_diagram.png" alt="der_diagramT" width="700" height="750">
  </p>

### Pattern Utilizzati

- **MVC (Model-View-Controller)**: Il pattern MVC è stato scelto per separare la logica di business dalla presentazione e dalla gestione delle richieste. Questo permette di mantenere il codice modulare e facilmente manutenibile. Occore tuttavia fare una precisazione: ai fini del progetto la componente **View** non viene applicata non essendoci una vista vera e propria.
- **Repository Pattern**: Il Repository Pattern è stato utilizzato per astrarre la logica di accesso ai dati, fornendo una chiara separazione tra la logica di business e la logica di accesso ai dati. Questo rende il codice più testabile e manutenibile. L'interazione con il database avviene tramite Sequelize. Un esempio di Repository viene mostrato di seguito:

  ```javascript
   import Gate from "../models/GateModel"; // Import the Gate model
   import Route from "../models/RouteModel"; // Import the Route model

   class GateRepository {
      // Method to create a new gate
      async create(data: any): Promise<Gate> {
         return await Gate.create(data);
      }

      // Method to retrieve all gates
      async getAll(): Promise<Gate[]> {
         return await Gate.findAll();
      }

      // Method to retrieve a gate by its ID
      async getById(gateId: number): Promise<Gate | null> {
         return await Gate.findByPk(gateId);
      }

      // Method to update a gate by its ID
      async update(id: number, data: any): Promise<number> {
         const [updated] = await Gate.update(data, {
            where: { id },
         });
         return updated;
      }

      // Method to delete a gate by its ID
      async delete(id: number): Promise<number> {
         // Check for dependencies in routes
         const routeDependency = await Route.findOne({ where: { startGateId: id } })
                                    || await Route.findOne({ where: { endGateId: id } });
         if (routeDependency) {
            throw new Error('Cannot delete gate: it has associated routes.');
         }

         return await Gate.destroy({ where: { id: id } });
      }
   }

   export default new GateRepository(); // Export an instance of GateRepository

  ```

## Avviare il Progetto

### Prerequisiti

- Docker
- Docker-compose

### Istruzioni

1. Clonare il repository:
    ```
    git clone https://github.com/enricopierga/ProgrammazioneAvanzata2024
    cd ProgrammazioneAvanzata2024
    ```

2. Configurare le variabili d'ambiente:
    Creare due file ```.env``` all'interno delle directory ```payments``` e ```transits```, configurandoili con le seguenti variabili d'ambiente:
    ```
    DB_NAME=defaultDb
    DB_USER=dbUser
    DB_PASS=mySecretPassword
    DB_HOST=localhost
    DB_PORT=5432
    ```

3. Avviare i servizi con Docker Compose:
    ```bash
    docker-compose up --build
    ```

4. Accedere ai servizi:
    - Backend Pagamenti: `http://localhost:3000`
    - Backend Transiti: `http://localhost:3001`

## Test del Progetto


### Postman

È possibile testare il progetto utilizzando Postman. Forniamo una collection Postman che contiene tutte le richieste necessarie per testare le API. Importare la collection in Postman e seguire le istruzioni per testare le diverse rotte.

[Scarica la Collection Postman](path_to_postman_collection.json)

### Esempi di Richieste
### Login nel sistema

- **POST /login**

  Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:
  
  ```json
     {
       "username" : "pangolino",
       "password": "12345" 
     }
  ```
  Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:
  ![login](./diagrams/sequenceDiagrams/login.png)

  Se la richiesta viene effettuata correttamente viene restituito il seguente messaggio:

  ```json
     {
       "accessToken": {
         "jwt": "MY_JWT_TOKEN"
       }
     }
  ```
  In caso di errore invece, come in questo caso (utente non presente nel sistema):
  ```json
     {
      "username":"giacomo",
      "password":"PureDrive10!"
     }
  ```
  Verrà generato il seguente errore:
  ```json
     status: 404 NOT_FOUND
     {
       "message": "User not found"
     }
  ```

### Rotta protetta (decodeJWT)
- **/protectedRoute**
  
  Questo esempio raffigura il comportamento in caso di accesso ad una rotta protetta, il meccanismo che si innesca è descritto dal sequente diagramma:
  <p align="center">
     <img src="./diagrams/sequenceDiagrams/decodeJWT.png" alt="decodeJWT" width="600" height="800">
  </p>

  In caso di accesso alla rotta da parte di un utente non autorizzato, il messaggio è il seguente:
  ```json
     status: 403 FORBIDDEN
     {
       "message": "Forbidden"
     }
  ```
  In caso di token errato, il messaggio è il seguente:
  ```json
     status: 401 UNAUTHORIZED
     {   
        "message": "Unauthorized"
     }
  ```
  
### CRUD per la Gestione dei Varchi
- **POST /gate**
  
  Un esempio di body della richiesta potrebbe essere il seguente (la descrizione è facoltativa):
  ```json
    {
      "location": "Location 1",
      "descrizione": "Varco omologato e testato"
    }
  ```
  Se la richiesta viene effettuata correttamente, la risposta sarà la seguente:
  ```json
    {
      "id": 2,
      "location": "Location 1",
      "description": "Varco omologato e testato"
      "updatedAt": "2024-07-17T19:43:32.942Z",
      "createdAt": "2024-07-17T19:43:32.942Z",
    }
  ```
- **GET /gate(?id)**
  
  La seguente rotta permette di recuperare tutti i varchi salvati oppure un particolare varco specificando il suo ```id``` tramite parametro di query:
  ```json
    [{
      "id": 1,
      "location": "Location 1",
      "description": "Varco omologato e testato"
      "updatedAt": "2024-07-17T19:43:32.942Z",
      "createdAt": "2024-07-17T19:43:32.942Z",
    },
    {
      "id": 2,
      "location": "Location 2",
      "description": "Varco omologato e testato"
      "updatedAt": "2024-07-17T19:44:50.942Z",
      "createdAt": "2024-07-17T19:44:50.942Z",
    },
    {
      "id": 3,
      "location": "Location 3",
      "description": "Varco omologato e testato"
      "updatedAt": "2024-07-17T19:45:12.942Z",
      "createdAt": "2024-07-17T19:45:12.942Z",
    }]
  ```

- **PATCH /gate/:id**
  
  La seguente rotta permette di aggiornare i campi di un varco specificandoli nel body della richiesta e indicando il suo ```id``` come parametro nell'url path:
  
  ```json
    {
      "location": "New Location 1"
    }
  ```
  Se la richiesta viene eseguita correttamente, il risultato della risposta sarà un messaggio di avvenuta modifica:
  ```json
    {
      "message": "Gate updated successfully"
    }
  ```
  
- **DELETE /gate/:id**
  
  Questa rotta permette di eliminare un varco specifico tramite ```id``` come parametro nell’url path:
  ```json
    {
      "message": "Gate deleted successfully"
    }
  ```

### CRUD per la Gestione delle Tratte
- **POST /route**
  
  Un esempio di body della richiesta potrebbe essere il seguente:
  ```json
    {
      "startGateId": 1,
      "endGateId": 2,
      "distance": 50
    }
  ```
  Se la richiesta viene effettuata correttamente, la risposta è la seguente:
  ```json
    {
      "id": 1,
      "startGateId": 1,
      "endGateId": 2,
      "distance": 1500,
      "updatedAt": "2024-07-17T19:43:32.942Z",
      "createdAt": "2024-07-17T19:43:32.942Z"
    }
  ```

- **GET /route(?id)**
  
  Questa rotta permette di recuperare tutte le tratte salvate:
  ```json
    [{
      "id": 1,
      "startGateId": 1,
      "endGateId": 2,
      "distance": 1500,
      "updatedAt": "2024-07-17T19:43:32.942Z",
      "createdAt": "2024-07-17T19:43:32.942Z"
    },
    {
      "id": 2,
      "startGateId": 2,
      "endGateId": 3,
      "distance": 3500,
      "updatedAt": "2024-07-17T19:44:50.942Z",
      "createdAt": "2024-07-17T19:44:50.942Z"
    }]
  ```
    
  Questa rotta permette inoltre di recuperare una specifica tratta utilizzando il suo ```id``` come parametro di query:
  
  ```json
    {
      "id": 1,
      "startGateId": 1,
      "endGateId": 2,
      "distance": 1500,
      "updatedAt": "2024-07-17T19:43:32.942Z",
      "createdAt": "2024-07-17T19:43:32.942Z"
    }
  ```

- **PATCH /route/:id**
  
  Questa rotta permette di aggiornare una tratta specifica utilizzando il suo ```id``` come parametro nell'url path e specificando i campi da aggiornare nel body della richiesta:
  ```json
    {
      "startGateId": 1,
      "endGateId": 3,
      "distance": 3500
    }
  ```
  Se la richiesta viene eseguita correttamente, il risultato della risposta sarà un messaggio di avvenuta modifica:
  ```json
    {
      "message": "Route updated successfully"
    }
  ```

- **DELETE /route/:id**
  
  Questa rotta permette di eliminare una tratta specifica tramite il suo ```id``` come parametro nell'url path:
  ```json
    {
      "message": "Route deleted successfully"
    }
  ```

### CRUD per la Gestione dei Veicoli
- **POST /vehicle**
  
  Un esempio di body della richiesta potrebbe essere il seguente:
  ```json
    {
      "licensePlate": "AB123CD",
      "type": "Car",
      "userId": 1
    }
  ```
  Se la richiesta viene effettuata correttamente, la risposta è la seguente:
  ```json
    {
      "id": 1,
      "licensePlate": "AB123CD",
      "type": "Car",
      "userId": 1,
      "updatedAt": "2024-07-17T19:43:32.942Z",
      "createdAt": "2024-07-17T19:43:32.942Z"
    }
  ```

- **GET /vehicle(?id)**
  
  Questa rotta permette di recuperare tutti i veicoli salvati:
  ```json
    [{
      "id": 1,
      "licensePlate": "AB123CD",
      "type": "Car",
      "userId": 1,
      "updatedAt": "2024-07-17T19:43:32.942Z",
      "createdAt": "2024-07-17T19:43:32.942Z"
    },
    {
      "id": 2,
      "licensePlate": "EF456GH",
      "type": "Truck",
      "userId": 2,
      "updatedAt": "2024-07-17T19:44:50.942Z",
      "createdAt": "2024-07-17T19:44:50.942Z"
    }]
  ```
    
  Questa rotta permette inoltre di recuperare uno specifico veicolo utilizzando il suo ```id``` come parametro di query:
  
  ```json
    {
      "id": 1,
      "licensePlate": "AB123CD",
      "type": "car",
      "userId": 1,
      "updatedAt": "2024-07-17T19:43:32.942Z",
      "createdAt": "2024-07-17T19:43:32.942Z"
    }
  ```

- **PATCH /vehicle/:id**
  
  Questa rotta permette di aggiornare un veicolo specifico utilizzando il suo ```id``` come parametro nell'url path e specificando i campi da aggiornare nel body della richiesta:
  ```json
    {
      "licensePlate": "AB123CD",
      "type": "Truck"
    }
  ```
  Se la richiesta viene eseguita correttamente, il risultato della risposta sarà un messaggio di avvenuta modifica:
  ```json
    {
      "message": "Vehicle deleted successfully"
    }
  ```
- **DELETE /vehicle/:id**
  
  Questa rotta permette di eliminare un veicolo specifico tramite il suo ```id```, se la richiesta va a buon fine il risultato della risposta sarà un messaggio di avvenuta eliminazione:
  ```json
    {
      "message": "Vehicle updated successfully"
    }
  ```

### CRUD per la Gestione dei Transiti (e Generazione delle Multe)
- **POST /transit**
  
  Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:
  ```json
    {
      "licensePlate": "AA123BB",
      "routeId": 1,
      "travelTime": 3600,
      "weather": "clear"
    }
    ```
  Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma delle sequenze:
  ![transit_post](./diagrams/sequenceDiagrams/transit-post.png)

  Se la richiesta viene effettuata correttamente, viene restituito il seguente messaggio nel caso in cui la velocità media del transito non superi la velocità limite:
  ```json
    {
        "id": 1,
        "routeId": 1,
        "travelTime": 70,
        "weather": "Rainy",
        "vehicleId": 1,
        "updatedAt": "2024-07-16T13:57:59.349Z",
        "createdAt": "2024-07-16T13:57:59.349Z"
    }
  ```
  Se invece la velocità media calcolata supera la velocità limite, verrà generata automaticamente la multa e verrà visualizzato il seguente json:
  ```json    
    {
    "transit": {
        "id": 1,
        "routeId": 1,
        "travelTime": 50,
        "weather": "Rainy",
        "vehicleId": 1,
        "updatedAt": "2024-07-16T13:57:59.349Z",
        "createdAt": "2024-07-16T13:57:59.349Z"
        },
    "infraction": {
        "paid": false,
        "vehicleId": 1,
        "routeId": 1,
        "userId": 1,
        "speed": 144,
        "limit": 110,
        "weather": "Rainy",
        "amount": 150,
        "timestamp": "2024-07-16T13:57:59.353Z",
        "id": 5,
        "uuid": "b606694c-8742-4860-aea8-7d3f99f7debe",
        "updatedAt": "2024-07-16T13:57:59.355Z",
        "createdAt": "2024-07-16T13:57:59.355Z"
        }
    }
  ```

- **GET /transit(?id)**
  
  La seguente rotta permette di recuperare tutti i transiti salvati oppure un particolare transito specificandone il `id` tramite parametro di query:
  ```json
    [{
      "id": 1,
      "routeId": 1,
      "travelTime": 70,
      "weather": "Rainy",
      "vehicleId": 1,
      "updatedAt": "2024-07-16T13:57:59.349Z",
      "createdAt": "2024-07-16T13:57:59.349Z"
    },
    {
      "id": 2,
      "routeId": 2,
      "travelTime": 60,
      "weather": "Clear",
      "vehicleId": 2,
      "updatedAt": "2024-07-16T14:01:12.349Z",
      "createdAt": "2024-07-16T14:01:12.349Z"
    }]
  ```
  Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma delle sequenze:
  ![transit_get](./diagrams/sequenceDiagrams/transit-get.png)

- **PATCH /transit/:transitId**

  La seguente rotta permette di aggiornare i campi di un transito specificandoli nel body della richiesta e indicando il `transitId` come parametro nell'URL:
  ```json
    {
      "travelTime": 80,
      "weather": "Clear"
    }
  ```
  Se la richiesta viene eseguita correttamente, il risultato della risposta sarà un messaggio di avvenuta modifica:
  ```json
    {
      "message": "Transit updated successfully"
    }
  ```
  Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma delle sequenze:
  ![transit_update](./diagrams/sequenceDiagrams/transit-update.png)

- **DELETE /transit/:transitId**

  La seguente rotta permette di eliminare un transito specificando il suo `transitId` come parametro nell'URL.
  Se la richiesta viene eseguita correttamente, il risultato della risposta sarà un messaggio di avvenuta eliminazione:
  ```json
    {
      "message": "Transit deleted successfully"
    }
  ```
  Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma delle sequenze:
  ![transit_delete](./diagrams/sequenceDiagrams/transit-delete.png)

### Richiesta Multe per Targa e Periodo
- **GET /infraction**

    Per poter ottenere una risposta, il corpo della richiesta dovrà seguire il seguente modello:
    ```json
      {
        "plates": ["AB123CD", "EF456GH"],
        "startDate": "2024-01-01",
        "endDate": "2024-07-21"
      }
    ```
    Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma delle sequenze:
    ![infraction_get_by](./diagrams/sequenceDiagrams/infraction-get-by.png)

    Se la richiesta viene effettuata correttamente, verrà restituito il seguente messaggio:
    ```json
      [{
        "plate": "AB123CD",
        "type": "Car",
        "route": {
          "inGate": "Location 1",
          "outGate": "Location 2",
          "distance": 50
        },
        "averageSpeed": 90,
        "limitSpeed": 80,
        "speedDelta": 10,
        "weather": "Clear",
        "amount": 150,
        "uuid": "b606694c-8742-4860-aea8-7d3f99f7debe",
        "datetime": "2024-07-16T13:57:59.353Z"
      },
      {
        "plate": "EF456GH",
        "type": "Truck",
        "route": {
          "inGate": "Location 2",
          "outGate": "Location 3",
          "distance": 60
        },
        "averageSpeed": 70,
        "limitSpeed": 60,
        "speedDelta": 10,
        "weather": "Rainy",
        "amount": 150,
        "uuid": "c306694c-8742-4860-aea8-7d3f99f7debf",
        "datetime": "2024-07-17T14:00:00.000Z"
      }]
    ```
### Ottenere il credito di un utente
- **GET /credit**
  Per poter ottenere una risposta non è necessario inserire un body, basta essere autenticati tramite JWT.
  Se la richiesta viene effettuata correttamente viene restituito il seguente messaggio:

  ```json
     {
        "balance": 50
     }
  ```

  **NOTA:** l'accesso a questa rotta è garantito agli utenti Automobilista ed Operatore.

  In caso di errore invece, ovvero di utente non autorizzato, verrà generato il seguente messaggio ed il relativo status code associato:
  ```json
     status: 403 FORBIDDEN
     {
       "message": "Forbidden"
     }
  ```

### Aggiungere il credito ad un utente
- **PATCH /:id/credit**
  Per poter ottenere una risposta, il corpo delle richieste dovrà seguire il seguente modello:
  
  ```json
     {
       "amount" : 1000
     }
  ```
  Il meccanismo che si innesca all'atto della chiamata è descritto dal seguente diagramma:
  ![add_Credit](./diagrams/sequenceDiagrams/addCredit.png)

  **NOTA:** l'accesso a questa rotta è garantito solamente all'utente di tipo Admin.

  In caso di errore, ovvero di utente non autorizzato, verrà generato il seguente messaggio ed il relativo status code associato:
  ```json
     status: 403 FORBIDDEN
     {
        "message": "Forbidden"
     }
  ```

  In caso di errore di inserimento, dell'inserimento di una stringa al posto di un numero, verrà generato il seguente messaggio ed il relativo status code associato:

  Richiesta:

  ```json
     {
        "amount": "Mille"
     }  
  ```

  Risposta:

  ```json
     status: 400 BAD_REQUEST
     {
        "message": "Missing or wrong amount value"
     }
  ```



#### Effettuare un Pagamento
- **POST /payments**
  Per poter ottenere una risposta, il corpo della richiesta dovrà essere il seguente:
  ```json
    {
      "paymentUuid": "UUID_PAYMENT",
    }
  ```

  In caso di UUID corretto e di credito sufficiente, verrà restituito l'oggetto Infraction corrispondente, ed il suo stato di "paid" passerà a true:

  ```json
    {
        "id": 2,
        "vehicleId": 2,
        "routeId": 2,
        "userId": 2,
        "speed": 198,
        "limit": 80,
        "weather": "rainy",
        "amount": 150,
        "timestamp": "2024-07-18T11:09:30.044Z",
        "uuid": "6836178f-0c79-4c10-88ec-75bae54fd6a4",
        "paid": true,
        "createdAt": "2024-07-18T11:09:30.045Z",
        "updatedAt": "2024-07-18T11:09:30.045Z"
    }
  ```
  In caso di UUID corretto e di credito insufficiente, verrà restituito il seguente messaggio di errore:

  ```json
    status: 402 PAYMENT_REQUIRED
    {
       "message": "Insufficient Balance"
    }
  ```

  In questo caso, l'utente dovrà contattare l'Admin del sistema in modo da poter ricaricare il suo credito e poter effettuare il pagamento delle sue Infractions.

  Nel caso in cui il formato dell'UUID inserito non sia corretto, verrà restituito il seguente messaggio di errore:

  ```json
    status: 400 BAD_REQUEST
    {
       "message": "Invalid uuid format"
    }  
  ```

  Se il formato è corretto ma l'UUID non appartiene a nessuna Infraction, allora verrà restituito il seguente messaggio di errore:

  ```json
    status: 404 NOT_FOUND
    {
       "message": "Not found"
    }
  ```


#### Scaricare Bollettino di Pagamento
- **GET /payments/:id/pdf**

  
### Autori
- Enrico Piergallini
- Davide De Grazia
