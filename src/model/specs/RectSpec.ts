import { ShapeSpec } from '../ShapeSpec';
import { Shape } from '../Shape';
import { RectShape } from '../shapes/RectShape';

/** rect: create rect <id> <x> <y> <w> <h> [fill] */
export class RectSpec extends ShapeSpec {
  override get type(): string {
    return 'rect';
  }

  override get usage(): string {
    return 'rect <id> <x> <y> <w> <h> [fill]';
  }

  override create(id: string, args: string[]): Shape {
    const x = this.numberAt(args, 0, 'x');
    const y = this.numberAt(args, 1, 'y');
    const w = this.numberAt(args, 2, 'w');
    const h = this.numberAt(args, 3, 'h');
    return new RectShape(id, x, y, w, h, this.optionalAt(args, 4));
  }
}
