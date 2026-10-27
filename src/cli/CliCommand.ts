import { EditorContext } from './EditorContext';

/** 一条 CLI 命令（init / create / undo / …）。 */
export abstract class CliCommand {
  /** 命令名（分派键）。 */
  abstract get name(): string;

  /** help 里显示的用法串。 */
  abstract get usage(): string;

  /** help 里显示的一句话说明。 */
  abstract get description(): string;

  /** 可选别名（同样参与分派）。 */
  aliases(): string[] {
    return [];
  }

  /** 是否让 REPL 退出（只有 exit 返回 true）。 */
  stopsRepl(): boolean {
    return false;
  }

  /** 执行并返回要输出的行（不含 `svg>` 提示符）。 */
  abstract run(args: string[], context: EditorContext): string[];
}
