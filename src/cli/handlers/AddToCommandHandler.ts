import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireContainer, requireDocument, requireShape, runEdit } from '../CommandSupport';
import { AddToCommand } from '../../commands/AddToCommand';
import { CliError } from '../../shared/CliError';

/** addto <gid> <id>：把已有图形移入容器（作为最后一个子节点）。 */
export class AddToCommandHandler extends CliCommand {
  override get name(): string {
    return 'addto';
  }

  override get usage(): string {
    return 'addto <gid> <id>';
  }

  override get description(): string {
    return '把已有图形移入容器（末尾）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    if (args[0] === undefined || args[1] === undefined) {
      throw new CliError(`usage: ${this.usage}`);
    }
    const container = requireContainer(document, args[0]);
    const target = requireShape(document, args[1]);
    if (target === container || target.contains(container)) {
      throw new CliError(`cannot move a container into its own descendant: ${target.id}`);
    }
    return runEdit(context, new AddToCommand(document, target, container));
  }
}
