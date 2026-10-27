import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireShape } from '../CommandSupport';
import { TreeRenderer } from '../TreeRenderer';

/** tree [id]：结构树（默认整篇文档）。 */
export class TreeCommandHandler extends CliCommand {
  override get name(): string {
    return 'tree';
  }

  override get usage(): string {
    return 'tree [id]';
  }

  override get description(): string {
    return '结构树（属性内联）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    if (args[0] === undefined || args[0] === '') {
      return new TreeRenderer().render(document, document.root);
    }
    const target = requireShape(document, args[0]);
    return new TreeRenderer().render(document, target);
  }
}
