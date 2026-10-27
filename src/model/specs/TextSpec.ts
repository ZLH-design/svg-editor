import { ShapeSpec } from '../ShapeSpec';
import { Shape } from '../Shape';
import { TextShape } from '../shapes/TextShape';

/** text: create text <id> <x> <y> "content" */
export class TextSpec extends ShapeSpec {
  override get type(): string {
    return 'text';
  }

  override get usage(): string {
    return 'text <id> <x> <y> "content"';
  }

  override create(id: string, args: string[]): Shape {
    const x = this.numberAt(args, 0, 'x');
    const y = this.numberAt(args, 1, 'y');
    const content = args.slice(2).join(' ');
    return new TextShape(id, x, y, content);
  }
}
