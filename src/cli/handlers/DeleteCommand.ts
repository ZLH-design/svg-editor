import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireShape, runEdit } from '../CommandSupport';
import { DeleteCommand } from '../../commands/DeleteCommand';
import { CliError } from '../../shared/CliError';

/** delete <id>：删除图形（容器则连同子孙）。 */
export class DeleteCommandHandler extends CliCommand {
  override get name(): string {
    return 'delete';
  }

  override get usage(): string {
    return 'delete <id>';
  }

  override get description(): string {
    return '删除图形（容器连同全部子孙）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    if (args[0] === undefined) throw new CliError('missing <id>');
    const target = requireShape(document, args[0]);
    return runEdit(context, new DeleteCommand(document, target));
  }
}
