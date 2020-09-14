const filter = require("./filter");
const io = require("./io");

async function analyze() {
  const goatWC1TCRSequences = await io.fasta.parseFiles([
    "input/m54328U_200810_210526.Q20.fasta",
  ]);

  const goatBuckets = await io.fasta.parseFiles(["input/goat-buckets.fasta"]);

  const bucketMatches = {
    none: { sequence: null, matches: [] },
    trash: { seqence: null, matches: [] },
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
        matchingBuckets.push(bucket.name);
        matchesAny = true;
      }
    });
    if (!matchesAny) {
      bucketMatches.none.matches.push(sequence);
    }
    if (matchingBuckets.length > 1) {
      const matchingBucketNamesWithoutR = matchingBuckets.map((bucketName) =>
        bucketName.replace("r", "")
      );
      if (
        matchingBucketNamesWithoutR.some(
          (name) => matchingBucketNamesWithoutR[0] !== name
        )
      ) {
        bucketMatches.trash.matches.push(sequence);
        console.log("TRASH FOUND:", sequence.name);
        console.log("  -> Found in buckets: ", matchingBuckets.join(", "));
        numDupes++;
      }
    }
    if (
      matchingBuckets.length > 0 &&
      !bucketMatches.trash.matches.includes(sequence)
    ) {
      bucketMatches[matchingBuckets[0]].matches.push(sequence);
    }
  });

  console.log("Buckets:");
  Object.keys(bucketMatches).map((bucketName) => {
    const match = bucketMatches[bucketName];
    console.log(`${bucketName}: ${match.sequence ? match.sequence.seq : ""}`);
    console.log(`  -> ${match.matches.length} matching sequences`);
  });

  if (numDupes > 0) {
    console.log(`${numDupes} trash sequences were found!`);
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
