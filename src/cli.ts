import { program } from 'commander';
import { mergeJunitFiles } from './lib';

interface ProgramOptions {
  output: string;
}

program
  .description('A CLI that merges a few "junit.xml" files into one')
  .requiredOption('-o, --output <./junit.jml>', 'path to the merged junit.jml to output')
  .argument('<glob>', 'glob pattern to find junit.jml files')
  .action((glob: string, options: ProgramOptions) => {
    mergeJunitFiles(options.output, glob);
  });

export const run = () => {
  program.parse();
};
