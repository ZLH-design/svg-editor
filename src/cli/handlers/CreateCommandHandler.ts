import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireContainer, requireDocument, runEdit } from '../CommandSupport';
import { CreateCommand } from '../../commands/CreateCommand';
import { CliError } from '../../shared/CliError';
import { GroupShape } from '../../model/shapes/GroupShape';

/** create <type> <id> [params…] [in <containerId>] */
export class CreateCommandHandler extends CliCommand {
  override get name(): string {
    return 'create';
  }

  override get usage(): string {
    return 'create <type> <id> [params…] [in <containerId>]';
  }

  override get description(): string {
    return '创建图形；尾缀 in 指定父容器（缺省挂到画布根）';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    const type = args[0];
    const id = args[1];
    if (type === undefined) {
      throw new CliError(`usage: ${this.usage}`);
    }
    if (!context.factory.has(type)) {
      throw new CliError(`unknown shape type: ${type} (is the plugin loaded?)`);
    }
    if (id === undefined || id === '') {
      throw new CliError('missing <id>');
    }
    if (document.has(id)) {
      throw new CliError(`id already exists: ${id}`);
    }

    const { params, containerId } = this.splitInClause(args.slice(2));
    const parent: GroupShape =
      containerId === null ? document.root : requireContainer(document, containerId);
    const shape = context.factory.create(type, id, params);
    return runEdit(context, new CreateCommand(document, shape, parent));
  }

  /** 尾部可选 `in <containerId>` 子句。 */
  private splitInClause(rest: string[]): { params: string[]; containerId: string | null } {
    if (rest.length >= 2 && rest[rest.length - 2] === 'in') {
      return { params: rest.slice(0, rest.length - 2), containerId: rest[rest.length - 1] };
    }
    return { params: rest, containerId: null };
  }
}
