import { EditCommand } from './EditCommand';
import { CliError } from '../shared/CliError';

/**
 * undo / redo 栈（Command 模式的 Invoker）。
 *
 * 规则：文档类命令（init / read / save / canvas 改尺寸）执行后清空栈并上锁，
 * 直到下一次编辑命令重新解禁。
 */
export class CommandHistory {
  private readonly undoStack: EditCommand[] = [];
  private readonly redoStack: EditCommand[] = [];
  private locked = false;

  /** 记录一条已成功执行的编辑命令，并清空 redo 栈、解除 io 锁。 */
  push(command: EditCommand): void {
    this.undoStack.push(command);
    this.redoStack.length = 0;
    this.locked = false;
  }

  /** 文档类命令之后调用：禁止跨文档撤销。 */
  lockAfterDocumentIo(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.locked = true;
  }

  isLocked(): boolean {
    return this.locked;
  }

  canUndo(): boolean {
    return !this.locked && this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return !this.locked && this.redoStack.length > 0;
  }

  undo(): string {
    if (this.locked) {
      throw new CliError('undo not allowed after io command');
    }
    const command = this.undoStack.pop();
    if (command === undefined) {
      throw new CliError('nothing to undo');
    }
    const message = command.undo();
    this.redoStack.push(command);
    return message;
  }

  redo(): string {
    if (this.locked) {
      throw new CliError('redo not allowed after io command');
    }
    const command = this.redoStack.pop();
    if (command === undefined) {
      throw new CliError('nothing to redo');
    }
    const message = command.execute();
    this.undoStack.push(command);
    return message;
  }
}
