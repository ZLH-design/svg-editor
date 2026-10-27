import { Document } from '../model/Document';

/**
 * 编辑命令基类（Command 模式）。
 *
 * 一条命令 = 一个 undo 单元：execute 返回成功回显文本，undo 返回撤销回显文本。
 * 命令自己保存足够的落点信息，因此 undo 不需要对整个文档做快照。
 */
export abstract class EditCommand {
  protected readonly document: Document;

  constructor(document: Document) {
    this.document = document;
  }

  abstract execute(): string;

  abstract undo(): string;
}
