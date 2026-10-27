import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireShape, runEdit } from '../CommandSupport';
import { UngroupCommand } from '../../commands/UngroupCommand';
import { GroupShape } from '../../model/shapes/GroupShape';
import { CliError } from '../../shared/CliError';

/** ungroup <gid>：解散容器，子图形提升到原容器的父级。 */
export class UngroupCommandHandler extends CliCommand {
  override get name(): string {
    return 'ungroup';
  }

  override get usage(): string {
    return 'ungroup <gid>';
  }

  override get description(): string {
    return '解散容器（子图形上提一级）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    if (args[0] === undefined) throw new CliError('missing <gid>');
    const target = requireShape(document, args[0]);
    if (!target.isContainer()) {
      throw new CliError(`not a container: ${target.id}`);
    }
    const group = target as GroupShape;
    // 复合图形（插件类型，如 box）内部结构由插件所有，不允许拆散。
    if (group.extraAttributes().some(([name]) => name === 'data-kind')) {
      throw new CliError(`cannot ungroup composite shape: ${group.id}`);
    }
    // 根级容器（svg 的直接子节点）不允许解散——见 doc/README.md「过程记录」中的口径说明。
    const parent = group.parent;
    if (parent === null || document.isRoot(parent)) {
      throw new CliError(`cannot ungroup top-level container: ${group.id}`);
    }
    return runEdit(context, new UngroupCommand(document, group));
  }
}
