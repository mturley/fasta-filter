const Fasta = require('biojs-io-fasta');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile); // Wtf why is this necessary
const writeFile = util.promisify(fs.writeFile);
Array.prototype.max = function () { return Math.max.apply(null, this); };
Array.prototype.min = function () { return Math.min.apply(null, this); };


const INPUT_FILENAMES = [
  'm180419_175649_42183_c101456052550000001823301308121870_s1_p0.1.subreads.fasta',
  'm180419_175649_42183_c101456052550000001823301308121870_s1_p0.2.subreads.fasta',
  'm180419_175649_42183_c101456052550000001823301308121870_s1_p0.3.subreads.fasta'
];

async function readSequences() {
  const options = { encoding: 'UTF-8' };
  const files = [
    await readFile(INPUT_FILENAMES[0], options),
    await readFile(INPUT_FILENAMES[1], options),
    await readFile(INPUT_FILENAMES[2], options)
  ];
  const parsedFiles = files.map(file => Fasta.parse(file)); // Array of Array of Sequences
  const sequences = [].concat.apply([], parsedFiles); // Array of Sequences
  return sequences;
};

async function extractLongSequences(cutoffLength, longFilename, shortFilename) {
  const sequences = await readSequences();

  const longSequences = sequences.filter(s => s.seq.length > cutoffLength);
  const shortSequences = sequences.filter(s => s.seq.length <= cutoffLength);

  console.log('Number of long sequences: ', longSequences.length);
  console.log('Number of short sequences: ', shortSequences.length);
  
  console.log('Exporting long sequences...');
  await writeFile(longFilename, Fasta.write(longSequences));
  console.log('Exported to ', longFilename, '!');

  console.log('Exporting short sequences...');
  await writeFile(shortFilename, Fasta.write(shortSequences));
  console.log('Exported to ', shortFilename, '!');
}

extractLongSequences(1300, 'long-sequences.txt', 'short-sequences.txt');