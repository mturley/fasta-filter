fasta-filter
============

A quick-and-dirty [NodeJS](https://nodejs.org/en/) program (or [maybe a library?](https://en.wikipedia.org/wiki/Library_\(computing\))) that can filter DNA sequences into different buckets in different simple ways.

Alie, read this part if nothing else!
=====================================

The only code here that should be read by non-technical users is [`analyze.js`](https://github.com/mturley/fasta-filter/blob/master/js/analyze.js), but **my goal is to make that file editable by non-programmers who have a teensy knowledge of JavaScript**. Or even to those who don't.

Eventually I will turn this thing into a simple command line tool, and you won't even have to understand analyze.js. But if you do... you can MAKE YOUR OWN fasta-filtering command line tools easily, with this code as a starter.

I love you, I'll leave you alone now. For those of you who are curious, here is the rest of the story:


Nerdy parts:
============

This project was written with the [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) in order to prioritize simplicity of the use of each of its functions. Potentially complex function calls are human-readable, taking advantage of this pattern and also the [object destructuring](https://javascript.info/destructuring-assignment#object-destructuring) feature of ES6. For example:

```js
const { longSequences, shortSequences } = filter(sequences).byLength(1300);
const buckets = filter(longSequences).intoBuckets().byExactMatch(bucketTests);
```

Thanks to https://github.com/biojs-io/biojs-io-fasta for the FASTA format parsing piece.
The rest is just the magic of vanilla JavaScript's [Array API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). Simple as that.


How to use:
===========

So far I haven't exported these modules for other npm packages to use. But,
you can clone/fork this repo and remove our starter input from `input/`, then
alter `analyze.js` to meet your needs. Run it at the command line, from the
root of this repo, with `./analyze`.

### The `io.fasta` module:
The `io.fasta` module takes fasta files and gives you an array of all the sequences in those files.
It can also take any array or arrays of sequences and turn them back into one or more fasta files.
The `sequence` objects here are [biojs-io-fasta](https://github.com/biojs-io/biojs-io-fasta) `Sequence` objects, which have the following shape:
```js
const sequence = {
  seq: "ATCGATCG",
  name: "awesome-seq",
  id: "unique id" // usually a number, just the order in which they appeared in the fasta file
}
```
The above `sequence` object is the equivalent of the following lines of FASTA plain text sequence format:
```
>awesome-seq
ATCGATCG
```
NOTE: **The sequence lines of FASTA format is limited to 80 characters. If your sequences are longer, they should be multiple up-to-80-character lines.**

Examples:
```js
// Reading files:
const io = require('./io');
const sequences = await io.fasta.parseFiles(['input/file1.fasta.txt', 'input/file2.fasta.txt']);

// Writing a single file:
io.fasta.saveFile(filteredSequences, 'output/results-filename.fasta.txt');

// Writing multiple files:
io.fasta.saveFiles({
  './output/long-sequences.fasta.txt': longSequences,
  './output/short-sequences.fasta.txt': shortSequences
});
```

### The `filter` module:
The `filter` module takes arrays of sequences and turns them into buckets.
In this context, a `bucket` is an object with filter parameters, and one or more arrays of sequences, as its properties.

In the examples below that do not use `intoBuckets()`, the result is a single bucket instead of an array of buckets. In these examples, the single buckets are immediately destructured and only some of its properties used.

`filter().byLength(cutoffLength)` returns a bucket object with properties `cutoffLength`, `longSequences`, and `shortSequences`.

`filter().byExactMatch(testSequence)` returns a bucket object with properties `testSequence`, `matchingSequences`, and `nonMatchingSequences`.

The arguments to the filter methods are provided along with the filtered sequences, so that you can tell which bucket you are looking at.

The `intoBuckets()` method returned by `filter()` can be used to produce multiple buckets from an array of different inputs, and contains all the same methods as the single-result `filter()` (currently `byLength` and `byExactMatch`).

Examples:
```js
// Filtering by sequence length in number of nucleotides:
const filter = require('./filter');
const { longSequences, shortSequences } = filter(sequences).byLength(1300);

// Filtering by exact match on a substring in some of the sequences:
const { matchingSequences } = filter(longSequences).byExactMatch(testSequence);

// Filtering into 3 buckets by exact match on each of 3 test sequences:
const buckets = filter(longSequences).intoBuckets().byExactMatch(testSequencesArray);
console.log(buckets.length); // 3
const { testSequence, matchingSequences, nonMatchingSequences } = buckets[2];
```

Advanced Example (this one I should probably make another module method for):
```js
// Generating multiple fasta files from multiple filtered buckets (avoiding slashes in filenames):
const removeSlashes = s => s.split('/').join('-');
io.fasta.saveFiles(buckets.reduce((sequenceArraysByFilename, bucket) => {
  const filename = `output/exact-match-bucket-${removeSlashes(bucket.testSequence.name)}.fasta.txt`;
  return {
    ...sequenceArraysByFilename,
    [filename]: bucket.matchingSequences
  };
}, {}));
```

These patterns can be mixed and matched, i.e. you could filter into different buckets by size with no further changes to the `filter` module.
