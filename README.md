# Jest JUnit Report Merger

Given a directory containing multiple JUnit XML reports, this tool will merge them into a single report.

## Why?

Other tools exist that can merge JUnit XML reports, but they were loosing the suite name and merging everything in the same suite. 
This tool will merge the reports and introduce and intermediate suite for each report.

The code of the other solution were also hard to test and maintain (no typescript).

## Commands

To use this tool, you must have Node installed. Then, you can run the following commands:

(1) Install dependencies

```bash
pnpm i @bam.tech/jest-junit-reports-merger # or npm i
```

(2) Run the tool

```bash
jjrm -o <output> <blob>
```

## Contribute

Feel free to contribute to this project by opening issues or pull requests.
To run the tests, you can use the following command:

```bash
pnpm test # or npm test
```
