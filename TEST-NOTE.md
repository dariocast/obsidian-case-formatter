# Prova Case Formatter

Questa è una nota di prova: copia questo file nel vault e aprilo in modalità modifica.

## Le quattro conversioni

Seleziona solo la riga seguente. Applica ciascun comando dalla palette cercando `Case Formatter`, poi annulla prima di provare il successivo:

il SIGNORE degli ANELLI

Risultati attesi:

- UPPERCASE: IL SIGNORE DEGLI ANELLI
- lowercase: il signore degli anelli
- Sentence case: Il signore degli anelli
- Capitalize Each Word: Il Signore Degli Anelli

## Accenti, apostrofi e trattini

PERCHÉ L'AMICO dell’ALBERO È GIÀ QUI? mother-in-LAW, DON'T, straße.

In Capitalize Each Word: `Perché L'amico Dell’albero È Già Qui? Mother-In-Law, Don't, Straße.`
In UPPERCASE: `PERCHÉ L'AMICO DELL’ALBERO È GIÀ QUI? MOTHER-IN-LAW, DON'T, STRASSE.`

## Frasi e righe

CIAO MONDO! COME STAI? TUTTO BENE.
È UNA NUOVA RIGA.

In Sentence case:

> Ciao mondo! Come stai? Tutto bene.
> È una nuova riga.

## Checklist nell'app

- [ ] Le quattro azioni compaiono nella palette comandi quando c'è una selezione.
- [ ] Le quattro azioni compaiono con il tasto destro sul testo selezionato.
- [ ] Una hotkey assegnata dalle impostazioni esegue la conversione.
- [ ] Il testo esterno alla selezione resta identico.
- [ ] Il testo convertito resta selezionato, anche per `straße` → `STRASSE`.
- [ ] Due conversioni consecutive si annullano una alla volta.
- [ ] La digitazione precedente e successiva ha un Undo separato dalla conversione.
- [ ] Redo ripristina la conversione.
- [ ] Senza selezione non viene cambiato nulla.
- [ ] Funziona sia in Live Preview sia in Source mode.
- [ ] Disattivando il plugin spariscono comandi e voci del menu.
