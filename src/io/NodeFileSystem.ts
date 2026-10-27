import * as fs from 'node:fs';
import { FileSystem } from './FileSystem';

/** FileSystem 的 Node 实现：唯一接触真实磁盘的地方。 */
export class NodeFileSystem implements FileSystem {
  readText(path: string): string {
    return fs.readFileSync(path, 'utf8');
  }

  writeText(path: string, text: string): void {
    fs.writeFileSync(path, text, 'utf8');
  }
}
