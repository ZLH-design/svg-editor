import { Document } from '../model/Document';
import { CommandHistory } from '../commands/CommandHistory';
import { ShapeFactory } from '../model/ShapeFactory';
import { FileSystem } from '../io/FileSystem';

/**
 * 命令处理器拿到的全部外部依赖（"上帝类"的反面：Session 只负责组装，不含业务）。
 */
export interface EditorContext {
  readonly history: CommandHistory;
  readonly factory: ShapeFactory;
  readonly files: FileSystem;
  hasDocument(): boolean;
  document(): Document;
  setDocument(document: Document): void;
}
