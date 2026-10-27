import { EditorContext } from './EditorContext';
import { CommandRegistry } from './CommandRegistry';
import { tokenize } from './Tokenizer';
import { CliError } from '../shared/CliError';
import { ShapeParamError } from '../model/ShapeParamError';
import { CliCommand } from './CliCommand';

export interface ExecutionResult {
  lines: string[];
  shouldExit: boolean;
}

/**
 * 一行输入 → 输出行。
 *
 * 职责只有三件：切词、按名字分派、把异常翻译成 `error:` 行。
 * 具体语义全部在各自的 CliCommand / EditCommand 里。
 */
export class Interpreter {
  private readonly registry: CommandRegistry;

  constructor(registry: CommandRegistry) {
    this.registry = registry;
  }

  execute(line: string, context: EditorContext): ExecutionResult {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      return { lines: [], shouldExit: false };
    }
    const tokens = tokenize(trimmed);
    const handler = this.registry.get(tokens[0]);
    if (handler === undefined) {
      return { lines: [`error: unknown command: ${tokens[0]}`], shouldExit: false };
    }
    try {
      const lines = handler.run(tokens.slice(1), context);
      return { lines, shouldExit: handler.stopsRepl() };
    } catch (error) {
      return { lines: [`error: ${this.messageOf(error)}`], shouldExit: false };
    }
  }

  /** 命令表（供 help 与测试使用）。 */
  commands(): CliCommand[] {
    return this.registry.commands();
  }

  private messageOf(error: unknown): string {
    if (error instanceof CliError || error instanceof ShapeParamError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
