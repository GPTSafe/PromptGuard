// This file includes code which was modified from https://github.com/openai/gpt-2
// This file inclused code which was modified from https://github.com/NickHeiner/GPT-3-Encoder

import * as fs from 'fs';
import * as path from 'path';

const encoder: { [key: string]: number } = JSON.parse(
  fs.readFileSync(path.join(__dirname, './encoder.json'), 'utf-8')
);
const bpe_file: string = fs.readFileSync(
  path.join(__dirname, './vocab.bpe'),
  'utf-8'
);

const range = (x: number, y: number): number[] => {
  const res = Array.from(Array(y).keys()).slice(x);
  return res;
};

const ord = (x: string): number => {
  return x.charCodeAt(0);
};

const chr = (x: number): string => {
  return String.fromCharCode(x);
};

const textEncoder = new TextEncoder();
const encodeStr = (str: string): string[] => {
  return Array.from(textEncoder.encode(str)).map(x => x.toString());
};

const textDecoder = new TextDecoder();
const decodeStr = (arr: string[]): string => {
  return textDecoder.decode(new Uint8Array(arr.map(Number)));
};

function dictZip(x: string[][], y: number[]): { [key: string]: number } {
  const result: { [key: string]: number } = {};
  x.map((keyArr, i) => {
    result[keyArr.join('')] = y[i];
  });
  return result;
}

function bytes_to_unicode(): { [key: number]: string } {
  const bs: number[] = range(ord('!'), ord('~') + 1).concat(
    range(ord('¡'), ord('¬') + 1),
    range(ord('®'), ord('ÿ') + 1)
  );

  const cs: number[] = bs.slice();
  let n = 0;
  for (let b = 0; b < 2 ** 8; b++) {
    if (!bs.includes(b)) {
      bs.push(b);
      cs.push(2 ** 8 + n);
      n = n + 1;
    }
  }

  const csChars: string[] = cs.map(x => chr(x));

  const result: { [key: number]: string } = {};
  bs.map((_, i) => {
    result[bs[i]] = csChars[i];
  });
  return result;
}

function get_pairs(word: string[]): Set<string[]> {
  const pairs = new Set<string[]>();
  let prev_char = word[0];
  for (let i = 1; i < word.length; i++) {
    const char = word[i];
    pairs.add([prev_char, char]);
    prev_char = char;
  }
  return pairs;
}

const pat =
  /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;

const decoder: { [key: number]: string } = {};
Object.keys(encoder).map(x => {
  decoder[encoder[x]] = x;
});

const lines = bpe_file.split('\n');

const bpe_merges: string[][] = lines.slice(1, lines.length - 1).map(x => {
  return x.split(/(\s+)/).filter(function (e) {
    return e.trim().length > 0;
  });
});

const byte_encoder = bytes_to_unicode();
const byte_decoder: { [key: string]: string } = {};
Object.keys(byte_encoder).map(x => {
  byte_decoder[byte_encoder[Number(x)]] = x;
});

const bpe_ranks = dictZip(bpe_merges, range(0, bpe_merges.length));
const cache: Map<string, string> = new Map<string, string>();

function bpe(token: string): string {
  if (cache.has(token)) {
    return cache.get(token) as string;
  }

  let word = token.split('');

  let pairs = get_pairs(word);

  if (!pairs) {
    return token;
  }

  let shouldContinue = true;

  while (shouldContinue) {
    const minPairs: { [key: number]: string[] } = {};
    Array.from(pairs).map(pair => {
      const rank = bpe_ranks[pair.join('')];
      minPairs[isNaN(rank) ? 10e10 : rank] = pair;
    });

    const bigram =
      minPairs[
        Math.min(
          ...Object.keys(minPairs).map(x => {
            return parseInt(x);
          })
        )
      ];

    if (!(bigram.join('') in bpe_ranks)) {
      shouldContinue = false;
    }

    const first = bigram[0];
    const second = bigram[1];
    let new_word: string[] = [];
    let i = 0;

    while (i < word.length) {
      const j = word.indexOf(first, i);
      if (j === -1) {
        new_word = new_word.concat(word.slice(i));
        shouldContinue = false;
      }
      new_word = new_word.concat(word.slice(i, j));
      i = j;

      if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
        new_word.push(first + second);
        i = i + 2;
      } else {
        new_word.push(word[i]);
        i = i + 1;
      }
    }

    word = new_word;
    if (word.length === 1) {
      shouldContinue = false;
    } else {
      pairs = get_pairs(word);
    }
  }

  const wordStr = word.join('');
  cache.set(token, wordStr);

  return wordStr;
}

function encode(text: string): number[] {
  let match: RegExpExecArray | null;
  const matches: string[] = [];
  let bpe_tokens: number[] = [];
  const regex = new RegExp(pat);

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[0]);
  }

  for (let token of matches) {
    token = encodeStr(token)
      .map(x => {
        return byte_encoder[Number(x)];
      })
      .join('');

    const new_tokens = bpe(token)
      .split(' ')
      .map(x => encoder[x]);
    bpe_tokens = bpe_tokens.concat(new_tokens);
  }
  return bpe_tokens;
}

function countTokens(text: string): number {
  let match: RegExpExecArray | null;
  const matches: string[] = [];
  const regex = new RegExp(pat);
  let count = 0;
  
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[0]);
  }
  


  for (let token of matches) {
    token = encodeStr(token)
      .map(x => {
        return byte_encoder[Number(x)];
      })
      .join('');

    count += bpe(token).split(' ').length;
  }
  return count;
}

function decode(tokens: number[]): string {
  let text = tokens.map(x => decoder[x]).join('');
  text = decodeStr(text.split('').map(x => byte_decoder[x]));
  return text;
}

export { encode, decode, countTokens };
