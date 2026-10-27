import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';

/** exit：退出 REPL（本阶段额外提供的便利命令，不参与作业命令表）。 */
export class ExitCommandHandler extends CliCommand {
  override get name(): string {
    return 'exit';
  }

  override aliases(): string[] {
    return ['quit'];
  }

  override get usage(): string {
    return 'exit';
  }

  override get description(): string {
    return '退出编辑器';
  }

  override stopsRepl(): boolean {
    return true;
  }

  override run(_args: string[], _context: EditorContext): string[] {
    return ['bye'];
  }
}
