// const BUCKETS_FILENAME = 'input/exact-match-buckets.fasta.txt';

const INPUT_FILENAMES = [
  'input/reads_of_insert.fasta'
];

const filter = require('./filter');
const io = require('./io');

async function analyze() {

  const sequences = await io.fasta.parseFiles(INPUT_FILENAMES);

  const { longSequences, shortSequences } = filter(sequences).byLength(100);

  io.fasta.saveFiles({
    './output/long-sequences.fasta.txt': longSequences,
    './output/short-sequences.fasta.txt': shortSequences
  });

  /*
  const bucketTests = await io.fasta.parseFiles([ BUCKETS_FILENAME ]);

  const buckets = filter(longSequences).intoBuckets().byExactMatch(bucketTests);

  const removeSlashes = s => s.split('/').join('-');

  io.fasta.saveFiles(buckets.reduce((sequencesByFilename, bucket) => {
    const filename = `output/exact-match-bucket-${removeSlashes(bucket.testSequence.name)}.fasta.txt`;
    return {
      ...sequencesByFilename,
      [filename]: bucket.matchingSequences
    };
  }, {}));

  // 3 buckets are fine but...
  // We need "limiting filtering"?

  const D6neg = buckets[1].negativeResult;
  const D6negByVCS = filter(D6neg).byExactMatch(bucketTests[2]);

  console.log('Is this about 15,000?', D6negByVCS.negativeResult.length);

  io.fasta.saveFile(D6negByVCS.negativeResult, 'D6negByVCS.fasta.txt');

  console.log('Hmm. Alie has a reason that D6negByVCS wasn\'t useful-- what\'s that reason?');
  console.log('Because it will still contain B-to-B sequences (she knows what that means, look at her venn diagrams)')


  // Alie has other filters
  // TODO : filter().???
  */

}

analyze();
