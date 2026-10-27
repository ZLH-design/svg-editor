import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';

/** undo：撤销上一次编辑命令。 */
export class UndoCommandHandler extends CliCommand {
  override get name(): string {
    return 'undo';
  }

  override get usage(): string {
    return 'undo';
  }

  override get description(): string {
    return '撤销上一次编辑命令';
  }

  override run(_args: string[], context: EditorContext): string[] {
    return [context.history.undo()];
  }
}
