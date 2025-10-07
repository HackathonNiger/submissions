// Fuzzy text recognition helpers using Levenshtein distance
// Provides utilities to match noisy ASR (speech-to-text) output to a list of known commands.

// Normalize and tokenize utilities
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s]/gi, ' ') // keep letters/numbers/space
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(s: string): string[] {
  const n = normalizeText(s);
  if (!n) return [];
  return n.split(' ').filter(Boolean);
}

// Quick ASR preprocessing to correct common mis-hearings before fuzzy matching.
// This maps frequently-observed mistaken words to their likely intended tokens.
export function preprocessASRText(s: string): string {
  let n = normalizeText(s);
  if (!n) return n;

  // Common substitutions observed from ASR: make these lowercase, word-boundary aware
  const subs: Array<[RegExp, string]> = [
    [/\bmonths\b/g, 'math'],
    [/\bmuch\b/g, 'math'],
    [/\bmatt\b/g, 'math'],
    [/\bmat\b/g, 'math'],
    [/\bmaths\b/g, 'math'],
    [/\badditional\b/g, 'addition'],
    [/\badditional\b/g, 'addition'],
    [/\baddition(al)?\b/g, 'addition'],
    [/\badmission\b/g, 'addition'],
    [/\bedition\b/g, 'addition'],
    [/\bmusic\b/g, 'basic'],
    [/\bamong\b/g, 'algebra'],
    // common filler phrases that sometimes appear — remove them
    [/\band if im\b/g, ''],
    [/\band if i m\b/g, ''],
    [/\band if i'?m\b/g, ''],
    [/\bi'?ll be shown\b/g, ''],
    [/\bi differ\b/g, ''],
  ];

  for (const [re, to] of subs) {
    n = n.replace(re, to);
  }

  // Collapse spaces again
  n = n.replace(/\s+/g, ' ').trim();
  return n;
}

// Levenshtein distance (iterative, memory-optimized)
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  // ensure a is the shorter one to use less memory for previous row
  if (al > bl) {
    const tmp = a;
    a = b;
    b = tmp;
  }

  const prev = new Array(a.length + 1);
  for (let i = 0; i <= a.length; i++) prev[i] = i;

  for (let j = 1; j <= b.length; j++) {
    let pj = j - 1;
    let current = j;
    for (let i = 1; i <= a.length; i++) {
      const insertCost = prev[i] + 1;
      const deleteCost = current + 1;
      const replaceCost = pj + (a[i - 1] === b[j - 1] ? 0 : 1);
      pj = prev[i];
      current = Math.min(insertCost, deleteCost, replaceCost);
      prev[i] = current;
    }
  }

  return prev[a.length];
}

// similarity: normalized 0..1 where 1 means identical, 0 means completely different
export function similarityForPair(a: string, b: string): number {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const dist = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - dist / maxLen;
}

// Type for match result
export interface MatchResult {
  command: string;
  score: number; // 0..1 higher is better
  distance: number; // total distance (lower is better)
  matchedWindow?: string[]; // words from the input that best matched
}

// Core matcher: given an input text and a list of candidate commands (phrases),
// it finds which candidate best matches a contiguous window of the input tokens.
// It uses per-word Levenshtein similarity and returns the command with the highest
// average similarity over the best window alignment.
export function findBestCommandMatch(
  inputText: string,
  candidates: string[],
  opts?: {
    // minimum average similarity [0..1] required to accept a match
    threshold?: number;
    // allow matching with fewer words than the candidate (partial match)
    allowPartial?: boolean;
    // if true, will prefer longer candidate matches when scores tie
    preferLonger?: boolean;
  }
): MatchResult | null {
  const { threshold = 0.65, allowPartial = true, preferLonger = true } = opts || {};
  const inputTokens = tokenize(inputText);
  if (inputTokens.length === 0) return null;

  let best: MatchResult | null = null;

  for (const candidate of candidates) {
    const candTokens = tokenize(candidate);
    if (candTokens.length === 0) continue;

    // If candidate is single word, test each input token individually
    if (candTokens.length === 1) {
      let bestForCandidate: MatchResult | null = null;
      for (let i = 0; i < inputTokens.length; i++) {
        const tok = inputTokens[i];
        const sim = similarityForPair(tok, candTokens[0]);
        const dist = levenshteinDistance(tok, candTokens[0]);
        const score = sim; // single-word score
        if (!bestForCandidate || score > bestForCandidate.score) {
          bestForCandidate = {
            command: candidate,
            score,
            distance: dist,
            matchedWindow: [tok],
          };
        }
      }

      if (bestForCandidate && bestForCandidate.score >= threshold) {
        if (!best || bestForCandidate.score > best.score || (preferLonger && bestForCandidate.command.length > best.command.length)) {
          best = bestForCandidate;
        }
      }
      continue;
    }

    // For multi-word candidate, slide a window over input tokens with size = candidate length
    // Optionally allow smaller windows (partial matches) if allowPartial is true.
    const windowSizes = [candTokens.length];
    if (allowPartial) {
      // also try windows one smaller down to 1
      for (let k = candTokens.length - 1; k >= 1; k--) windowSizes.push(k);
    }

    for (const winSize of windowSizes) {
      if (winSize > inputTokens.length) continue;
      for (let start = 0; start <= inputTokens.length - winSize; start++) {
        const window = inputTokens.slice(start, start + winSize);

        // Align candidate tokens to window tokens. If sizes differ, we align last N tokens of candidate
        // to the window (so partial candidate matches the end of the phrase), e.g. candidate "basic math"
        // with window ["basic","much"] aligns both, if window shorter we align right-most tokens.
        const offset = Math.max(0, candTokens.length - window.length);

        let totalSim = 0;
        let totalDist = 0;
        let compareCount = 0;

        for (let wi = 0; wi < window.length; wi++) {
          const candIndex = wi + offset;
          const candWord = candTokens[candIndex];
          const inWord = window[wi];
          const sim = similarityForPair(inWord, candWord);
          const dist = levenshteinDistance(inWord, candWord);
          totalSim += sim;
          totalDist += dist;
          compareCount++;
        }

        const avgSim = compareCount > 0 ? totalSim / compareCount : 0;
        const match: MatchResult = {
          command: candidate,
          score: avgSim,
          distance: totalDist,
          matchedWindow: window,
        };

        if (match.score >= threshold) {
          if (
            !best ||
            match.score > best.score ||
            (match.score === best.score && preferLonger && candidate.length > best.command.length)
          ) {
            best = match;
          }
        }
      }
    }
  }

  return best;
}

// Convenience: returns boolean if inputText matches any candidate above threshold
export function isCommandMatch(
  inputText: string,
  candidates: string[],
  threshold = 0.65
): boolean {
  return findBestCommandMatch(inputText, candidates, { threshold }) !== null;
}

// Example usage (commented):
// import { findBestCommandMatch } from './text-recognition';
// const cmds = ['basic math','intermediate math','algebra'];
// const res = findBestCommandMatch('basic much', cmds, { threshold: 0.6 });
// if (res) console.log('matched', res.command, res.score, res.matchedWindow);
