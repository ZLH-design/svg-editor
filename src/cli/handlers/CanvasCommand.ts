import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireNumber } from '../CommandSupport';
import { formatNumber } from '../../util/NumberFormat';

/** canvas [w] [h]：无参数显示画布尺寸，带参数修改尺寸（文档类操作，会上 undo 锁）。 */
export class CanvasCommand extends CliCommand {
  override get name(): string {
    return 'canvas';
  }

  override get usage(): string {
    return 'canvas [w] [h]';
  }

  override get description(): string {
    return '显示 / 修改画布尺寸';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    if (args.length === 0) {
      return [`canvas ${formatNumber(document.width)}x${formatNumber(document.height)}`];
    }
    const width = requireNumber(args[0], 'w');
    const height = args.length > 1 ? requireNumber(args[1], 'h') : document.height;
    document.setSize(width, height);
    context.history.lockAfterDocumentIo();
    return [`canvas ${formatNumber(width)}x${formatNumber(height)}`];
  }
}
