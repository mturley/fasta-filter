const filter = require("./filter");
const io = require("./io");

async function analyze() {
  const goatWC1TCRSequences = await io.fasta.parseFiles([
    "input/m54328U_200810_210526.Q20.fasta",
  ]);

  const goatBuckets = await io.fasta.parseFiles(["input/goat-buckets.fasta"]);

  const bucketMatches = {
    none: { sequence: null, matches: [] },
    ...goatBuckets.reduce(
      (matches, bucket) => ({
        ...matches,
        [bucket.name]: { sequence: bucket, matches: [] },
      }),
      {}
    ),
  };

  let numDupes = 0;

  goatWC1TCRSequences.forEach((sequence) => {
    let matchesAny = false;
    const matchingBuckets = [];
    goatBuckets.forEach((bucket) => {
      const matchesBucket = sequence.seq.includes(bucket.seq);
      if (matchesBucket) {
        bucketMatches[bucket.name].matches.push(sequence);
        matchingBuckets.push(bucket.name);
        matchesAny = true;
      }
    });
    if (!matchesAny) {
      bucketMatches.none.matches.push(sequence);
    }
    if (matchingBuckets.length > 1) {
      console.log("DUPLICATE FOUND:", sequence.name);
      console.log("  -> Found in buckets: ", matchingBuckets.join(", "));
    }
  });

  console.log("Buckets:");
  Object.keys(bucketMatches).map((bucketName) => {
    const match = bucketMatches[bucketName];
    console.log(`${bucketName}: ${match.sequence ? match.sequence.seq : ""}`);
    console.log(`  -> ${match.matches.length} matching sequences`);
  });

  if (numDupes > 0) {
    console.log(`${numDupes} duplicates were found!`);
  }

  const sequencesByFilename = Object.keys(bucketMatches).reduce(
    (newObj, bucketName) => ({
      ...newObj,
      [`output/goatWC1TCR-matches-${bucketName}.fasta`]: bucketMatches[
        bucketName
      ].matches,
    }),
    {}
  );

  await io.fasta.saveFiles(sequencesByFilename);
}

analyze();
