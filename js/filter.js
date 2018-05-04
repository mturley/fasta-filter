

function filter(sequences) {

  const log = {
    filteringBy: something =>
      console.log(`--- FILTERING ${sequences.length} SEQUENCES BY ${something} ---`),
    numberOf: (seq, something) =>
      console.log(`Number of ${something} sequences: ${seq.length}`)
  };

  async function byLength(cutoffLength) {
    log.filteringBy('LENGTH');
    const longSequences = sequences.filter(s => s.seq.length > cutoffLength);
    const shortSequences = sequences.filter(s => s.seq.length <= cutoffLength);
    log.numberOf(longSequences, 'long');
    log.numberOf(shortSequences, 'short');
    return { longSequences, shortSequences };
  }

  async function byExactMatch(testSequence) {
    log.filteringBy(`EXACT MATCH with ${testSequence.title}`);
    const matchingSequences = sequences.filter(s => s.seq.includes(testSequence.seq));
    const nonMatchingSequences = sequences.filter(s => !s.seq.includes(testSequence.seq));
    log.numberOf(matchingSequences, 'matching');
    log.numberOf(nonMatchingSequences, 'non-matching');
    return { matchingSequences, nonMatchingSequences };
  }

  return { byLength, byExactMatch };
}

module.exports = filter;
