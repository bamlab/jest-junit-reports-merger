import fs from 'fs-extra';
import glob from 'fast-glob';

export class FileSystem {
  constructor(private readonly root: string) {}

  listFilesPath(globPattern: string): string[] {
    return glob.sync(globPattern, { cwd: this.root, dot: true });
  }

  readFileContent(path: string): string {
    return fs.readFileSync(path, 'utf8');
  }

  writeFileContent(path: string, content: string) {
    //fs.mkdirpSync(this.root);
    return fs.writeFileSync(path, content, { encoding: 'utf8' });
  }
}
