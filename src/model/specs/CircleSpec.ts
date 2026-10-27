import { ShapeSpec } from '../ShapeSpec';
import { Shape } from '../Shape';
import { CircleShape } from '../shapes/CircleShape';

/** circle: create circle <id> <cx> <cy> <r> [fill] */
export class CircleSpec extends ShapeSpec {
  override get type(): string {
    return 'circle';
  }

  override get usage(): string {
    return 'circle <id> <cx> <cy> <r> [fill]';
  }

  override create(id: string, args: string[]): Shape {
    const cx = this.numberAt(args, 0, 'cx');
    const cy = this.numberAt(args, 1, 'cy');
    const r = this.numberAt(args, 2, 'r');
    return new CircleShape(id, cx, cy, r, this.optionalAt(args, 3));
  }
}
