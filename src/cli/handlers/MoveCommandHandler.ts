import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireNumber, requireShape, runEdit } from '../CommandSupport';
import { MoveCommand } from '../../commands/MoveCommand';

/** move <id> <dx> <dy>：增量平移。 */
export class MoveCommandHandler extends CliCommand {
  override get name(): string {
    return 'move';
  }

  override get usage(): string {
    return 'move <id> <dx> <dy>';
  }

  override get description(): string {
    return '平移（增量）；容器整体平移';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    const target = requireShape(document, args[0]);
    const dx = requireNumber(args[1], 'dx');
    const dy = requireNumber(args[2], 'dy');
    return runEdit(context, new MoveCommand(document, target, dx, dy));
  }
}
