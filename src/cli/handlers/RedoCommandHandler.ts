import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';

/** redo：重做；undo 后若有新编辑则 redo 栈清空。 */
export class RedoCommandHandler extends CliCommand {
  override get name(): string {
    return 'redo';
  }

  override get usage(): string {
    return 'redo';
  }

  override get description(): string {
    return '重做被撤销的编辑命令';
  }

  override run(_args: string[], context: EditorContext): string[] {
    return [context.history.redo()];
  }
}
