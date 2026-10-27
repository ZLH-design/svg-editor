import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { SvgReader } from '../../io/SvgReader';
import { CliError } from '../../shared/CliError';

/** read <file.svg>：读入 SVG 文件作为当前文档；缺 id 自动补并警告。 */
export class ReadCommand extends CliCommand {
  override get name(): string {
    return 'read';
  }

  override get usage(): string {
    return 'read <file.svg>';
  }

  override get description(): string {
    return '读入 SVG 文件（缺 id 自动补）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const path = args[0];
    if (path === undefined || path === '') {
      throw new CliError('missing <file.svg>');
    }
    let source: string;
    try {
      source = context.files.readText(path);
    } catch {
      throw new CliError(`cannot read file: ${path}`);
    }
    let result;
    try {
      result = new SvgReader(context.factory).parse(source);
    } catch {
      throw new CliError(`cannot read file: ${path}`);
    }
    result.document.setSourcePath(path);
    context.setDocument(result.document);
    context.history.lockAfterDocumentIo();
    return result.warnings.concat([`read ${path} (${result.document.elementCount()} elements)`]);
  }
}
