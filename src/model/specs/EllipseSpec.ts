import { ShapeSpec } from '../ShapeSpec';
import { Shape } from '../Shape';
import { EllipseShape } from '../shapes/EllipseShape';

/** ellipse: create ellipse <id> <cx> <cy> <rx> <ry> [fill] */
export class EllipseSpec extends ShapeSpec {
  override get type(): string {
    return 'ellipse';
  }

  override get usage(): string {
    return 'ellipse <id> <cx> <cy> <rx> <ry> [fill]';
  }

  override create(id: string, args: string[]): Shape {
    const cx = this.numberAt(args, 0, 'cx');
    const cy = this.numberAt(args, 1, 'cy');
    const rx = this.numberAt(args, 2, 'rx');
    const ry = this.numberAt(args, 3, 'ry');
    return new EllipseShape(id, cx, cy, rx, ry, this.optionalAt(args, 4));
  }
}
