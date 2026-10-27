import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireShape, runEdit } from '../CommandSupport';
import { ZOrderCommand } from '../../commands/ZOrderCommand';
import { CliError } from '../../shared/CliError';

/** front / back 的共同实现：toFront 决定移到末尾还是最前。 */
export abstract class ZOrderCommandHandler extends CliCommand {
  protected abstract get toFront(): boolean;

  override get usage(): string {
    return `${this.name} <id>`;
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    if (args[0] === undefined) throw new CliError('missing <id>');
    const target = requireShape(document, args[0]);
    return runEdit(context, new ZOrderCommand(document, target, this.toFront));
  }
}
