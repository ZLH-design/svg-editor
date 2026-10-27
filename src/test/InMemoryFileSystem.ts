import { FileSystem } from '../io/FileSystem';

/** 内存文件系统：测试里替代真实磁盘，顺便能断言 save 写出的内容。 */
export class InMemoryFileSystem implements FileSystem {
  private readonly store = new Map<string, string>();

  seed(path: string, text: string): void {
    this.store.set(path, text);
  }

  readText(path: string): string {
    const text = this.store.get(path);
    if (text === undefined) {
      throw new Error(`ENOENT: ${path}`);
    }
    return text;
  }

  writeText(path: string, text: string): void {
    this.store.set(path, text);
  }

  read(path: string): string | undefined {
    return this.store.get(path);
  }
}
