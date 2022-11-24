import glob from 'fast-glob';

export class FileSystem {
  constructor(private readonly root: string) {}

  listFilesPath(globPattern: string): string[] {
    return glob.sync(globPattern, { cwd: this.root, dot: true });
  }
}
