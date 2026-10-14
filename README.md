# Case Formatter

Un plugin per Obsidian che cambia le maiuscole e le minuscole del testo selezionato, dalla palette comandi, dalle scorciatoie da tastiera o dal menu contestuale dell'editor.

| Comando | Esempio da `il SIGNORE degli ANELLI` |
| --- | --- |
| UPPERCASE | `IL SIGNORE DEGLI ANELLI` |
| lowercase | `il signore degli anelli` |
| Sentence case | `Il signore degli anelli` |
| Capitalize Each Word | `Il Signore Degli Anelli` |

Le quattro operazioni seguono le definizioni generali di [Microsoft Word](https://support.microsoft.com/en-us/word/change-the-capitalization-or-case-of-text). Non viene riprodotto il motore linguistico di Office.

## Installazione manuale

Richiede Obsidian **1.5.0 o successivo**. Il plugin usa API compatibili con desktop e mobile; la prima prova manuale va eseguita su desktop. Non è ancora pubblicato nel catalogo dei plugin.

1. Scarica lo ZIP dalla [pagina Releases](https://github.com/dariocast/obsidian-case-formatter/releases/latest) ed estrailo. All'interno trovi la cartella `case-formatter`. Se hai compilato il progetto, lo ZIP è in `dist/case-formatter-1.0.0.zip`.
2. Apri la cartella del tuo vault. Copia `case-formatter` dentro `.obsidian/plugins/`, creando `plugins` se manca. Puoi anche copiare direttamente la cartella già estratta `dist/case-formatter`.
3. Controlla che i due file essenziali siano esattamente in questi percorsi:

   ```text
   IL-TUO-VAULT/
   └── .obsidian/
       └── plugins/
           └── case-formatter/
               ├── main.js
               └── manifest.json
   ```

4. Riavvia Obsidian. Vai in **Impostazioni → Plugin della comunità / Community plugins**. Se necessario abilita i plugin della comunità, quindi attiva **Case Formatter** nell'elenco dei plugin installati.
5. Apri una nota in modalità modifica, seleziona del testo e fai clic destro: vedrai le quattro azioni raggruppate nel menu. Sono disponibili anche nella palette comandi, cercando **Case Formatter**.

Su macOS le cartelle che iniziano con un punto sono nascoste: nel Finder premi **⌘⇧.** per mostrarle. Se hai configurato una cartella di configurazione diversa da `.obsidian`, usa quella.

Per installarlo non servono Node.js, npm o compilazioni. `styles.css` non è necessario perché il plugin usa l'interfaccia nativa di Obsidian.

## Scorciatoie

Vai in **Impostazioni → Tasti di scelta rapida / Hotkeys**, cerca **Case Formatter** e assegna le combinazioni che preferisci ai quattro comandi. Non ci sono hotkey predefinite.

## Comportamento

- Si modifica solo il testo selezionato, in Source mode e Live Preview. In Reading view passa prima alla modalità modifica.
- Senza selezione i comandi non sono disponibili e il plugin non aggiunge voci al menu.
- La selezione resta attiva dopo la conversione; puoi applicare un altro case senza riselezionare.
- Sono supportate selezioni multiple e lettere accentate. Le selezioni vengono aggiornate anche quando cambia la lunghezza, per esempio `straße` → `STRASSE`.
- Ogni conversione che cambia il testo genera un singolo passaggio nella cronologia nativa. **⌘Z** su Mac o **Ctrl+Z** su Windows/Linux annulla l'ultima conversione; il normale Redo la ripristina. Nessuno storico separato.
- **Capitalize Each Word** rende maiuscola l'iniziale di ogni parola, inclusi articoli e preposizioni, e minuscolo il resto. Gli apostrofi interni restano parte della parola (`L'AMICO` → `L'amico`, `DON'T` → `Don't`); il trattino separa le parole (`mother-in-law` → `Mother-In-Law`).
- **Sentence case** rende il testo minuscolo e applica la maiuscola all'inizio delle frasi e di ogni riga. Non riconosce nomi propri o sigle: `NASA` diventa `nasa` se non è all'inizio della frase. La distinzione tra abbreviazioni e fine frase non è linguistica e può richiedere correzioni manuali.
- Si converte il **Markdown letterale selezionato**. Se includi URL, destinazioni di link, wikilink o codice, anche le loro lettere vengono convertite: seleziona solo il testo che vuoi cambiare.
- Nessuna connessione di rete, telemetria, impostazione da salvare o modifica a note non selezionate.

## Prova rapida

Copia [TEST-NOTE.md](TEST-NOTE.md) nel vault e segui la checklist. Include frasi italiane, accenti, apostrofi e verifiche di Undo/Redo. I test automatici verificano le conversioni, la gestione delle selezioni, la cronologia CodeMirror e l'integrazione con un host Obsidian simulato; non sostituiscono la prova nell'app reale.

Per aggiornare una copia già installata, disattiva il plugin, sostituisci `main.js` e `manifest.json`, quindi riavvia Obsidian e riattivalo. Per rimuoverlo, disattivalo ed elimina la cartella `case-formatter` dal vault.

## Sviluppo

Richiede **Node.js 22.12+** e npm. Per creare lo ZIP serve anche il comando `zip` (già disponibile su macOS; in Ubuntu: `sudo apt install zip`).

```sh
npm ci
npm run check       # test, TypeScript e build di produzione
npm run package     # verifiche + cartella installabile + ZIP
npm run dev         # ricompila main.js quando cambiano i sorgenti
```

La build genera `main.js` nella radice. Il packaging genera `dist/case-formatter/` e `dist/case-formatter-1.0.0.zip`. I file generati e `node_modules` sono esclusi da Git. `npm run dev` ricompila il bundle ma non ricarica automaticamente Obsidian.

```text
src/format.ts       Regole di conversione senza dipendenze da Obsidian
src/editor.ts       Modifica atomica delle selezioni e aggiornamento delle posizioni
src/history.ts      Separazione delle conversioni nella cronologia nativa
src/main.ts         Comandi, menu contestuale e registrazione delle estensioni
tests/              Test con Vitest e cronologia CodeMirror reale
scripts/package.mjs Pacchetto installabile e controllo versioni
```

La CI esegue verifiche e packaging su Node.js 22 e 24, rendendo scaricabile il pacchetto come artifact. I pacchetti installabili pubblicati sono disponibili nella [pagina Releases](https://github.com/dariocast/obsidian-case-formatter/releases).

## Licenza

MIT — vedi [LICENSE](LICENSE).
