import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { SvgWriter } from '../../io/SvgWriter';
import { requireDocument } from '../CommandSupport';
import { CliError } from '../../shared/CliError';

/** save [file.svg]：保存当前文档；无参数时保存到读入时的路径。 */
export class SaveCommand extends CliCommand {
  override get name(): string {
    return 'save';
  }

  override get usage(): string {
    return 'save [file.svg]';
  }

  override get description(): string {
    return '保存当前文档（无参数时写回读入路径）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    const path = args[0] !== undefined && args[0] !== '' ? args[0] : document.sourcePath;
    if (path === null) {
      throw new CliError('no file name given. usage: save <file.svg>');
    }
    const text = new SvgWriter().serialize(document);
    try {
      context.files.writeText(path, text);
    } catch {
      throw new CliError(`cannot write file: ${path}`);
    }
    document.setSourcePath(path);
    context.history.lockAfterDocumentIo();
    return [`saved to ${path} (${document.elementCount()} elements)`];
  }
}
