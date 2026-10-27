import { ShapeSpec } from '../ShapeSpec';
import { Shape } from '../Shape';
import { LineShape } from '../shapes/LineShape';

/** line: create line <id> <x1> <y1> <x2> <y2> [stroke] */
export class LineSpec extends ShapeSpec {
  override get type(): string {
    return 'line';
  }

  override get usage(): string {
    return 'line <id> <x1> <y1> <x2> <y2> [stroke]';
  }

  override create(id: string, args: string[]): Shape {
    const x1 = this.numberAt(args, 0, 'x1');
    const y1 = this.numberAt(args, 1, 'y1');
    const x2 = this.numberAt(args, 2, 'x2');
    const y2 = this.numberAt(args, 3, 'y2');
    return new LineShape(id, x1, y1, x2, y2, this.optionalAt(args, 4));
  }
}
