import * as readline from 'node:readline';
import { Session } from './Session';

/**
 * 交互式外壳：只负责"读一行 → 交 Interpreter → 打印输出行"。
 * IO（stdin/stdout）集中在这里，Session 与它以下的层都不接触终端。
 */
export class Repl {
  private readonly session: Session;
  private readonly input: NodeJS.ReadableStream;
  private readonly output: { write(text: string): void };

  constructor(
    session: Session,
    input: NodeJS.ReadableStream = process.stdin,
    output: { write(text: string): void } = process.stdout,
  ) {
    this.session = session;
    this.input = input;
    this.output = output;
  }

  start(): void {
    const rl = readline.createInterface({
      input: this.input,
      output: this.output as NodeJS.WritableStream,
      prompt: 'svg> ',
    });
    rl.prompt();
    rl.on('line', (line) => {
      const result = this.session.run(line);
      for (const text of result.lines) {
        this.output.write(`${text}\n`);
      }
      if (result.shouldExit) {
        rl.close();
        return;
      }
      rl.prompt();
    });
    rl.on('close', () => {
      this.output.write('\n');
    });
  }
}
