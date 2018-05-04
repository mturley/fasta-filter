function filter(sequences) {

  const log = {
    filteringBy: something =>
      console.log(`--- FILTERING ${sequences.length} SEQUENCES BY ${something} ---`),
    numberOf: (seq, something) =>
      console.log(`Number of ${something} sequences: ${seq.length}`)
  };

  function byLength(cutoffLength) {
    log.filteringBy('LENGTH');
    const longSequences = sequences.filter(s => s.seq.length > cutoffLength);
    const shortSequences = sequences.filter(s => s.seq.length <= cutoffLength);
    log.numberOf(longSequences, 'long');
    log.numberOf(shortSequences, 'short');
    return { cutoffLength, longSequences, shortSequences }; // Length bucket
  }

  function byExactMatch(testSequence) {
    log.filteringBy(`EXACT MATCH with ${testSequence.name}`);
    const matchingSequences = sequences.filter(s => s.seq.includes(testSequence.seq));
    const nonMatchingSequences = sequences.filter(s => !s.seq.includes(testSequence.seq));
    log.numberOf(matchingSequences, 'matching');
    log.numberOf(nonMatchingSequences, 'non-matching');
    return { testSequence, matchingSequences, nonMatchingSequences }; // Exact match bucket
  }

  function intoBuckets() {
    return {
      byLength: bucketArgs => bucketArgs.map(byLength), // bucketArgs is a list of cutoffLengths
      byExactMatch: bucketArgs => bucketArgs.map(byExactMatch) // bucketArgs is a list of testSequences
    };
  }

  return { byLength, byExactMatch, intoBuckets };
}

module.exports = filter;
