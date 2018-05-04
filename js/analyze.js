const filter = require('./filter');
const io = require ('./io');

const SEARCH_FILENAME = 'input/exact-match-test-sequences.fasta.txt';

const INPUT_FILENAMES = [
  './input/m180419_175649_42183_c101456052550000001823301308121870_s1_p0.1.ccs.fasta',
  './input/m180419_175649_42183_c101456052550000001823301308121870_s1_p0.2.ccs.fasta',
  './input/m180419_175649_42183_c101456052550000001823301308121870_s1_p0.3.ccs.fasta'
];

async function analyze() {

  const sequences = await io.fasta.parseFiles(INPUT_FILENAMES);

  const { longSequences, shortSequences } = filter(sequences).byLength(1300);

  io.fasta.saveFiles({
    './output/long-sequences.fasta.txt': longSequences,
    './output/short-sequences.fasta.txt': shortSequences
  });

  const testSequences = await io.fasta.parseFiles([ SEARCH_FILENAME ]);
  
  const buckets = testSequences.map(testSequence =>
    filter(longSequences).byExactMatch(testSequence));

  io.fasta.saveFiles(buckets.reduce((files, bucket) => ({
    ...files,
    [`./output/exact-match-bucket-${sequence.title}`]: bucket
  }), {}));


}

analyze();
