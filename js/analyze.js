const BUCKETS_FILENAME = 'input/exact-match-buckets.fasta.txt';

const INPUT_FILENAMES = [
  'input/m180419_175649_42183_c101456052550000001823301308121870_s1_p0.1.ccs.fasta',
  'input/m180419_175649_42183_c101456052550000001823301308121870_s1_p0.2.ccs.fasta',
  'input/m180419_175649_42183_c101456052550000001823301308121870_s1_p0.3.ccs.fasta'
];

const filter = require('./filter');
const io = require ('./io');

async function analyze() {

  const sequences = await io.fasta.parseFiles(INPUT_FILENAMES);

  const { longSequences, shortSequences } = filter(sequences).byLength(1300);

  io.fasta.saveFiles({
    './output/long-sequences.fasta.txt': longSequences,
    './output/short-sequences.fasta.txt': shortSequences
  });

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


}

analyze();
