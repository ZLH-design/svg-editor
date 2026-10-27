import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { Document } from '../../model/Document';
import { requireNumber } from '../CommandSupport';

/** init [w] [h]：新建空画布（默认 800×600）作为当前文档。 */
export class InitCommand extends CliCommand {
  override get name(): string {
    return 'init';
  }

  override get usage(): string {
    return 'init [w] [h]';
  }

  override get description(): string {
    return '新建空画布（默认 800x600）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const width = args.length > 0 ? requireNumber(args[0], 'w') : 800;
    const height = args.length > 1 ? requireNumber(args[1], 'h') : 600;
    context.setDocument(new Document(width, height));
    context.history.lockAfterDocumentIo();
    return [`canvas ${width}x${height} created`];
  }
}
