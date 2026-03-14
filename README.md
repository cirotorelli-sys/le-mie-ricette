# 🍽️ Il Mio Ricettario — PWA

Ricettario digitale personale con calcolo automatico delle porzioni.
Funziona offline, si installa come app sul cellulare, gratuito.

---

## 📱 Come installarlo su GitHub Pages (10 minuti)

### PASSO 1 — Crea un account GitHub
1. Vai su **https://github.com**
2. Clicca **Sign up** e crea un account gratuito
3. Verifica la tua email

### PASSO 2 — Crea un nuovo repository
1. Una volta loggato, clicca il **+** in alto a destra → **New repository**
2. Nel campo **Repository name** scrivi: `ricettario`
3. Lascia tutto il resto invariato (Public, niente README)
4. Clicca **Create repository**

### PASSO 3 — Carica i file
1. Nella pagina del repository appena creato, clicca **uploading an existing file**
2. Trascina TUTTI i file e le cartelle del progetto nella finestra:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `.nojekyll`
   - cartella `css/` (con `style.css`)
   - cartella `js/` (con `data.js` e `app.js`)
   - cartella `icons/` (con `icon-192.png` e `icon-512.png`)
3. In basso scrivi un messaggio tipo "prima versione" e clicca **Commit changes**

### PASSO 4 — Attiva GitHub Pages
1. Vai su **Settings** (in alto nel repository)
2. Nel menu laterale clicca **Pages**
3. Sotto **Source** seleziona **Deploy from a branch**
4. Sotto **Branch** seleziona **main** e cartella **/ (root)**
5. Clicca **Save**
6. Aspetta 1-2 minuti, poi l'app sarà disponibile all'indirizzo:
   `https://TUONOME.github.io/ricettario`

---

## 📲 Come installare l'app sul cellulare

### Android (Chrome)
1. Apri Chrome e vai all'indirizzo del tuo sito
2. Appare un banner in basso "Installa l'app" → tocca **Installa**
3. Oppure: menu ⋮ → **Aggiungi alla schermata Home**
4. L'icona appare come un'app normale!

### iPhone (Safari)
1. Apri Safari (non Chrome!) e vai all'indirizzo
2. Tocca il pulsante **Condividi** (quadrato con freccia in su)
3. Scorri e tocca **Aggiungi alla schermata Home**
4. Tocca **Aggiungi**

---

## 🔗 Come condividere con altri

Una volta pubblicata, basta mandare il link:
`https://TUONOME.github.io/ricettario`

Chiunque lo apre può installarlo sul proprio telefono.
Puoi condividerlo su **WhatsApp, email, SMS**, ecc.

---

## ✨ Funzionalità

- ✅ Categorie: Antipasto, Primo, Secondo, Contorno, Dolce
- ✅ Calcolo automatico ingredienti per N persone
- ✅ Ricerca per nome, ingredienti, tag, origine
- ✅ Ordinamento per nome, valutazione, tempo, difficoltà
- ✅ Difficoltà (Facile / Medio / Difficile)
- ✅ Tag personalizzati
- ✅ Note personali per ogni ricetta
- ✅ Valutazione a stelle
- ✅ Modifica e eliminazione ricette
- ✅ Stampa ricetta ottimizzata
- ✅ Condivisione testo (WhatsApp, ecc.)
- ✅ Esporta / Importa ricette in formato JSON
- ✅ Funziona offline (Service Worker)
- ✅ Installabile come app (PWA)
- ✅ Dati salvati localmente sul dispositivo

---

## 🔄 Come aggiornare l'app

Se vuoi modificare le ricette di esempio o aggiungere funzionalità:
1. Modifica i file sul tuo computer
2. Vai sul repository GitHub
3. Carica i file aggiornati
4. GitHub Pages si aggiorna automaticamente in 1-2 minuti
5. Gli utenti vedono la versione aggiornata al prossimo accesso

---

## 💾 I dati dove vengono salvati?

I dati di ogni utente sono salvati **localmente sul suo dispositivo** (localStorage del browser). Non vanno su nessun server. Ogni persona ha il suo ricettario privato.

Per fare un backup, usa il pulsante **Esporta JSON** dall'app.
