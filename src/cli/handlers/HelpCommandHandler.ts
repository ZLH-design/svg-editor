import { CliCommand } from '../CliCommand';
import { EditorContext } from '../EditorContext';
import { CommandRegistry } from '../CommandRegistry';

/** help：显示全部命令与语法。 */
export class HelpCommandHandler extends CliCommand {
  private readonly registry: CommandRegistry;

  constructor(registry: CommandRegistry) {
    super();
    this.registry = registry;
  }

  override get name(): string {
    return 'help';
  }

  override get usage(): string {
    return 'help';
  }

  override get description(): string {
    return '显示全部命令与语法';
  }

  override run(_args: string[], context: EditorContext): string[] {
    const lines = ['commands:'];
    for (const command of this.registry.commands()) {
      lines.push(`  ${command.usage.padEnd(46, ' ')}${command.description}`);
    }
    lines.push('', 'shape types:');
    for (const usage of context.factory.usages()) {
      lines.push(`  create ${usage}`);
    }
    return lines;
  }
}
