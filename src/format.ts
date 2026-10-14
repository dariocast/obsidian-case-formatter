export type CaseMode = 'upper' | 'lower' | 'sentence' | 'words';

const firstLetter = /\p{L}/u;
const word = /\p{L}[\p{L}\p{M}\p{N}]*(?:['’][\p{L}\p{M}\p{N}]+)*/gu;

const capitalizeFirst = (text: string): string =>
  text.replace(firstLetter, letter => letter.toUpperCase());

// ICU may keep a period followed by lowercase text inside the same segment.
// Explicit punctuation boundaries also make already-lowercase input predictable.
const capitalizeSentenceStarts = (text: string): string =>
  text.replace(/(^|[.!?]+[\s»”"')\]]+)([^.!?]*)/gu,
    (_match, boundary: string, sentence: string) => boundary + capitalizeFirst(sentence));

function sentenceCase(text: string): string {
  const segmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('en', { granularity: 'sentence' })
    : undefined;

  // Treat each line independently, including headings and list items.
  return text.split(/(\r?\n)/u).map(line => {
    if (segmenter) {
      return Array.from(segmenter.segment(line), part => capitalizeSentenceStarts(part.segment)).join('');
    }
    return capitalizeSentenceStarts(line);
  }).join('');
}

/** Literal text conversion; formatting rules never inspect the surrounding note. */
export function formatText(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'words': return text.toLowerCase().replace(word, capitalizeFirst);
    case 'sentence': return sentenceCase(text.toLowerCase());
  }
}
