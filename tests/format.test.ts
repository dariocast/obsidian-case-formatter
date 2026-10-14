import { describe, expect, it } from 'vitest';
import { formatText } from '../src/format';

describe('formatText', () => {
  it.each([
    ['upper', 'IL SIGNORE DEGLI ANELLI'],
    ['lower', 'il signore degli anelli'],
    ['sentence', 'Il signore degli anelli'],
    ['words', 'Il Signore Degli Anelli'],
  ] as const)('%s follows the agreed Word-style example', (mode, expected) => {
    expect(formatText('il SIGNORE degli ANELLI', mode)).toBe(expected);
  });

  it('handles accented letters and Unicode case expansion', () => {
    expect(formatText('città, perché? straße', 'upper')).toBe('CITTÀ, PERCHÉ? STRASSE');
    expect(formatText('È GIÀ LÌ', 'lower')).toBe('è già lì');
    expect(formatText('e\u0300 GIA\u0300 QUI', 'words')).toBe('E\u0300 Gia\u0300 Qui');
  });

  it('keeps apostrophes inside words and capitalizes hyphenated words', () => {
    expect(formatText("L'AMICO dell’ALBERO DON'T mother-in-LAW", 'words'))
      .toBe("L'amico Dell’albero Don't Mother-In-Law");
  });

  it('capitalizes sentences and paragraphs, preserving punctuation and whitespace', () => {
    expect(formatText('  CIAO MONDO! «COME STAI?» TUTTO BENE.\nNUOVO PARAGRAFO\n\nÈ QUI.', 'sentence'))
      .toBe('  Ciao mondo! «Come stai?» Tutto bene.\nNuovo paragrafo\n\nÈ qui.');
  });

  it('does not treat a decimal point as a new sentence', () => {
    expect(formatText('IL VALORE È 3.14 EURO. VA BENE?', 'sentence'))
      .toBe('Il valore è 3.14 euro. Va bene?');
  });

  it.each(['upper', 'lower', 'sentence', 'words'] as const)('%s preserves blank input and layout', mode => {
    expect(formatText('', mode)).toBe('');
    expect(formatText(' \t\n\n', mode)).toBe(' \t\n\n');
    expect(formatText('  CIAO\tMONDO\n', mode).replace(/\p{L}/gu, '')).toBe('  \t\n');
  });

  it('has a sentence fallback for runtimes without Intl.Segmenter', () => {
    const descriptor = Object.getOwnPropertyDescriptor(Intl, 'Segmenter')!;
    Object.defineProperty(Intl, 'Segmenter', { value: undefined, configurable: true });
    try {
      expect(formatText('CIAO! «COME VA?» BENE.\nÈ QUI.', 'sentence'))
        .toBe('Ciao! «Come va?» Bene.\nÈ qui.');
    } finally {
      Object.defineProperty(Intl, 'Segmenter', descriptor);
    }
  });
});
