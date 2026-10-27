import { EditorContext } from './EditorContext';
import { CommandHistory } from '../commands/CommandHistory';
import { ShapeFactory } from '../model/ShapeFactory';
import { Document } from '../model/Document';
import { FileSystem } from '../io/FileSystem';
import { CommandRegistry } from './CommandRegistry';
import { Interpreter, ExecutionResult } from './Interpreter';
import { InitCommand } from './handlers/InitCommand';
import { ReadCommand } from './handlers/ReadCommand';
import { SaveCommand } from './handlers/SaveCommand';
import { CanvasCommand } from './handlers/CanvasCommand';
import { CreateCommandHandler } from './handlers/CreateCommandHandler';
import { DeleteCommandHandler } from './handlers/DeleteCommandHandler';
import { MoveCommandHandler } from './handlers/MoveCommandHandler';
import { ScaleCommandHandler } from './handlers/ScaleCommandHandler';
import { SetCommandHandler } from './handlers/SetCommandHandler';
import { GroupCommandHandler } from './handlers/GroupCommandHandler';
import { UngroupCommandHandler } from './handlers/UngroupCommandHandler';
import { AddToCommandHandler } from './handlers/AddToCommandHandler';
import { FrontCommandHandler } from './handlers/FrontCommandHandler';
import { BackCommandHandler } from './handlers/BackCommandHandler';
import { TreeCommandHandler } from './handlers/TreeCommandHandler';
import { ShowCommandHandler } from './handlers/ShowCommandHandler';
import { UndoCommandHandler } from './handlers/UndoCommandHandler';
import { RedoCommandHandler } from './handlers/RedoCommandHandler';
import { ExitCommandHandler } from './handlers/ExitCommandHandler';
import { HelpCommandHandler } from './handlers/HelpCommandHandler';
import { CliError } from '../shared/CliError';

/**
 * 会话：把各层组装起来并持有"当前文档"这一可变状态。
 * 它自己不含任何命令语义——所有行为都在 command / model / io 层。
 */
export class Session implements EditorContext {
  readonly history = new CommandHistory();
  readonly factory = new ShapeFactory();
  readonly files: FileSystem;

  private current: Document | null = null;
  private readonly registry = new CommandRegistry();
  private readonly interpreter: Interpreter;

  constructor(files: FileSystem) {
    this.files = files;
    this.registerCommands();
    this.interpreter = new Interpreter(this.registry);
  }

  hasDocument(): boolean {
    return this.current !== null;
  }

  document(): Document {
    if (this.current === null) {
      throw new CliError("no document. use 'init' or 'read' first");
    }
    return this.current;
  }

  setDocument(document: Document): void {
    this.current = document;
  }

  /** 执行一行（供 REPL 与测试共用同一条路径）。 */
  run(line: string): ExecutionResult {
    return this.interpreter.execute(line, this);
  }

  private registerCommands(): void {
    this.registry.register(new InitCommand());
    this.registry.register(new ReadCommand());
    this.registry.register(new SaveCommand());
    this.registry.register(new CanvasCommand());
    this.registry.register(new CreateCommandHandler());
    this.registry.register(new DeleteCommandHandler());
    this.registry.register(new MoveCommandHandler());
    this.registry.register(new ScaleCommandHandler());
    this.registry.register(new SetCommandHandler());
    this.registry.register(new GroupCommandHandler());
    this.registry.register(new UngroupCommandHandler());
    this.registry.register(new AddToCommandHandler());
    this.registry.register(new FrontCommandHandler());
    this.registry.register(new BackCommandHandler());
    this.registry.register(new TreeCommandHandler());
    this.registry.register(new ShowCommandHandler());
    this.registry.register(new UndoCommandHandler());
    this.registry.register(new RedoCommandHandler());
    this.registry.register(new HelpCommandHandler(this.registry));
    this.registry.register(new ExitCommandHandler());
  }
}
