import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { requireDocument, requireShape, runEdit } from '../CommandSupport';
import { GroupCommand } from '../../commands/GroupCommand';
import { Shape } from '../../model/Shape';
import { CliError } from '../../shared/CliError';

/** group <newGid> <id1> <id2>…：新建容器并收入若干图形。 */
export class GroupCommandHandler extends CliCommand {
  override get name(): string {
    return 'group';
  }

  override get usage(): string {
    return 'group <newGid> <id1> <id2>…';
  }

  override get description(): string {
    return '新建容器并把已有图形收编进去';
  }

  override run(args: string[], context: EditorContext): string[] {
    const document = requireDocument(context);
    const newId = args[0];
    const memberIds = args.slice(1);
    if (newId === undefined || memberIds.length === 0) {
      throw new CliError(`usage: ${this.usage}`);
    }
    if (document.has(newId)) {
      throw new CliError(`id already exists: ${newId}`);
    }
    const members: Shape[] = memberIds.map((id) => requireShape(document, id));
    this.rejectAncestorPairs(members);
    return runEdit(context, new GroupCommand(document, newId, members));
  }

  /** 拒绝"容器与其子孙同时被收编"——会形成环。 */
  private rejectAncestorPairs(members: Shape[]): void {
    for (const a of members) {
      for (const b of members) {
        if (a !== b && a.isContainer() && a.contains(b)) {
          throw new CliError(`cannot group a container into its own descendant: ${a.id}`);
        }
      }
    }
  }
}
