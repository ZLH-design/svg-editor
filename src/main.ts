import { Session } from './cli/Session';
import { Repl } from './cli/Repl';
import { NodeFileSystem } from './io/NodeFileSystem';

function main(): void {
  process.stdout.write("svg-editor 0.1 — type 'help' for commands\n");
  const session = new Session(new NodeFileSystem());
  new Repl(session).start();
}

main();
