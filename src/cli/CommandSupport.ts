import { Document } from '../model/Document';
import { Shape } from '../model/Shape';
import { GroupShape } from '../model/shapes/GroupShape';
import { EditorContext } from './EditorContext';
import { EditCommand } from '../commands/EditCommand';
import { CliError } from '../shared/CliError';
import { parseNumber } from '../util/NumberFormat';

/** 取当前文档，没有则报 `no document`。 */
export function requireDocument(context: EditorContext): Document {
  if (!context.hasDocument()) {
    throw new CliError("no document. use 'init' or 'read' first");
  }
  return context.document();
}

/** 按 id 取图形，不存在报 `no such shape`。 */
export function requireShape(document: Document, id: string): Shape {
  if (id === undefined || id === '') {
    throw new CliError('missing <id>');
  }
  const shape = document.lookup(id);
  if (shape === null) {
    throw new CliError(`no such shape: ${id}`);
  }
  return shape;
}

/** 按 id 取容器，不存在 / 不是容器分别报 `no such container` / `not a container`。 */
export function requireContainer(document: Document, id: string): GroupShape {
  if (id === undefined || id === '') {
    throw new CliError('missing <containerId>');
  }
  const shape = document.lookup(id);
  if (shape === null) {
    throw new CliError(`no such container: ${id}`);
  }
  if (!shape.isContainer()) {
    throw new CliError(`not a container: ${id}`);
  }
  return shape as GroupShape;
}

/** 解析必需的数字参数。 */
export function requireNumber(raw: string | undefined, name: string): number {
  const value = raw === undefined ? null : parseNumber(raw);
  if (value === null) {
    throw new CliError(`missing or invalid <${name}>`);
  }
  return value;
}

/** 执行编辑命令并入栈，返回回显行。 */
export function runEdit(context: EditorContext, command: EditCommand): string[] {
  const message = command.execute();
  context.history.push(command);
  return [message];
}
