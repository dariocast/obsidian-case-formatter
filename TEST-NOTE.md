# Case Formatter test note

Copy this file into your vault and open it in editing mode.

## The four conversions

Select only the following line. Apply each command from the command palette by searching for `Case Formatter`, then undo before trying the next command:

the LORD of the RINGS

Expected results:

- UPPERCASE: THE LORD OF THE RINGS
- lowercase: the lord of the rings
- Sentence case: The lord of the rings
- Capitalize Each Word: The Lord Of The Rings

## Accents, apostrophes, and hyphens

The following sample intentionally includes Italian and German words to test Unicode handling:

PERCHÉ L'AMICO dell’ALBERO È GIÀ QUI? mother-in-LAW, DON'T, straße.

Capitalize Each Word: `Perché L'amico Dell’albero È Già Qui? Mother-In-Law, Don't, Straße.`
UPPERCASE: `PERCHÉ L'AMICO DELL’ALBERO È GIÀ QUI? MOTHER-IN-LAW, DON'T, STRASSE.`

## Sentences and lines

HELLO WORLD! HOW ARE YOU? ALL GOOD.
THIS IS A NEW LINE.

Expected Sentence case result:

> Hello world! How are you? All good.
> This is a new line.

## In-app checklist

- [ ] All four actions appear in the command palette when text is selected.
- [ ] All four actions appear when right-clicking selected text.
- [ ] A hotkey assigned in settings runs the conversion.
- [ ] Text outside the selection remains unchanged.
- [ ] Converted text stays selected, including `straße` → `STRASSE`.
- [ ] Two consecutive conversions can be undone one at a time.
- [ ] Typing before and after a conversion has a separate Undo step.
- [ ] Redo restores the conversion.
- [ ] Nothing changes without a selection.
- [ ] The plugin works in both Live Preview and Source mode.
- [ ] Disabling the plugin removes its commands and menu items.
