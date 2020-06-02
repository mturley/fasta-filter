const filter = require("./filter");
const io = require("./io");

async function analyze() {
  const sequences = await io.fasta.parseFiles([
    "input/judy-pacbio-run-without-already-processed-seq.fasta.txt",
  ]);

  const sequenceNumbers = sequences.map((seq) => seq.name.split("/")[1]);
  const numFile = await io.generic.readFile("input/judy-pacbio-numbers.txt");
  const numbers = numFile.toString().split("\r\n");

  const numbersNotInSeqFile = numbers.filter(
    (num) => !sequenceNumbers.includes(num)
  );

  console.log(
    `Found ${numbersNotInSeqFile.length} numbers not in the sequence file:`
  );
  console.log(numbersNotInSeqFile);
}

analyze();
