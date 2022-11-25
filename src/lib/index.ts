import { FileSystem } from './fileSystem';
import { JUnitMerger } from './junitMerger';

export function mergeJunitFiles(output: string, junitFilesGlob: string) {
  const fileSystem = new FileSystem(process.cwd());
  const junitFiles = fileSystem.listFilesPath(junitFilesGlob);

  const junitFileContents = junitFiles.map(fileSystem.readFileContent);

  const junitMerger = new JUnitMerger();
  junitMerger.ingest(junitFileContents);

  fileSystem.writeFileContent(output, junitMerger.print());
}
