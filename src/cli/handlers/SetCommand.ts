import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireShape, runEdit } from '../CommandSupport';
import { SetCommand } from '../../commands/SetCommand';
import { CliError } from '../../shared/CliError';

/** set <id> <attr> <value>：设置白名单属性（含 text 的文本内容）。 */
export class SetCommandHandler extends CliCommand {
  override get name(): string {
    return 'set';
  }

  override get usage(): string {
    return 'set <id> <attr> <value>';
  }

  override get description(): string {
    return '设置属性（fill / stroke / stroke-width / 各类型几何属性 / text）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    const target = requireShape(document, args[0]);
    const attribute = args[1];
    const value = args.slice(2).join(' ');
    if (attribute === undefined || attribute === '') {
      throw new CliError('missing <attr>');
    }
    if (args.length < 3) {
      throw new CliError('missing <value>');
    }
    if (!target.supportsAttribute(attribute)) {
      throw new CliError(`unknown attribute: ${attribute}`);
    }
    return runEdit(context, new SetCommand(document, target, attribute, value));
  }
}
