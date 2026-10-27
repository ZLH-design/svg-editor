import { CliCommand } from './CliCommand';

/** 命令名 → 处理器的注册表（"按名字分派"的两处之一，且仅限此处）。 */
export class CommandRegistry {
  private readonly handlers = new Map<string, CliCommand>();
  private readonly order: CliCommand[] = [];

  register(command: CliCommand): void {
    if (!this.order.includes(command)) {
      this.order.push(command);
    }
    this.handlers.set(command.name, command);
    for (const alias of command.aliases()) {
      this.handlers.set(alias, command);
    }
  }

  get(name: string): CliCommand | undefined {
    return this.handlers.get(name);
  }

  /** 去重后的命令列表（别名不重复列出）。 */
  commands(): CliCommand[] {
    return this.order.slice();
  }
}
