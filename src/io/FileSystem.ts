/** 文件读写端口：隔离真实文件系统，便于测试与后续替换存储实现。 */
export interface FileSystem {
  readText(path: string): string;
  writeText(path: string, text: string): void;
}
