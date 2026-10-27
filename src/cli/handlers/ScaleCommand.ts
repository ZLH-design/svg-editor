import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireNumber, requireShape, runEdit } from '../CommandSupport';
import { ScaleCommand } from '../../commands/ScaleCommand';
import { CliError } from '../../shared/CliError';

/** scale <id> <factor>：等比缩放；容器递归到每个子孙。 */
export class ScaleCommandHandler extends CliCommand {
  override get name(): string {
    return 'scale';
  }

  override get usage(): string {
    return 'scale <id> <factor>';
  }

  override get description(): string {
    return '等比缩放（位置与尺寸同乘 factor）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    const target = requireShape(document, args[0]);
    const factor = requireNumber(args[1], 'factor');
    if (factor <= 0) {
      throw new CliError('scale factor must be positive');
    }
    return runEdit(context, new ScaleCommand(document, target, factor));
  }
}
