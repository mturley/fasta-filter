const Fasta = require("biojs-io-fasta");
const { readFile, writeFile } = require("./generic");

const READ_OPTIONS = { encoding: "UTF-8" };

/* 

===== A fasta.txt file looks like: =====

>sequenceName
ATCGATCGATCGATCGATCGATCGATCG

>anotherName
ATCGATCGATCGATCGATCGATCGATCG

===== A sequence object after parsing looks like: =====

{
  name: 'sequenceName',
  seq: 'ATCGATCGATCGATCGATCGATCGATCG',
  details: { ... }
}

*/

async function parseFiles(filenames) {
  const files = await Promise.all(
    filenames.map((filename) => {
      console.log(`=== PARSING FASTA FILE: ${filename} ===`);
      return readFile(filename, READ_OPTIONS);
    })
  );
  const parsedFiles = files.map((file) => Fasta.parse(file)); // Array of Array of Sequences
  const sequences = [].concat.apply([], parsedFiles); // Array of Sequences
  return sequences;
}

async function parseAll() {
  // TODO enumerate ./input/*
}

async function saveFile(sequences, filename) {
  console.log(`=== SAVING FILE TO ${filename} ===`);
  return await writeFile(filename, Fasta.write(sequences));
}

async function saveFiles(sequencesByFilename) {
  return Object.keys(sequencesByFilename).map(
    async (filename) => await saveFile(sequencesByFilename[filename], filename)
  );
}

module.exports = {
  parseFiles,
  parseAll,
  saveFile,
  saveFiles,
  readFile,
  writeFile,
};
