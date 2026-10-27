import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireShape } from '../CommandSupport';

/** show <id>：单个图形的属性明细。 */
export class ShowCommandHandler extends CliCommand {
  override get name(): string {
    return 'show';
  }

  override get usage(): string {
    return 'show <id>';
  }

  override get description(): string {
    return '显示单个图形的属性明细';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    const target = requireShape(document, args[0]);
    const lines = [`${target.label()}  parent=${document.parentLabelOf(target)}`];
    for (const detail of target.detailLines()) {
      lines.push(`  ${detail}`);
    }
    return lines;
  }
}
