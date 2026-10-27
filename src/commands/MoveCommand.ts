import { EditCommand } from './EditCommand';
import { Document } from '../model/Document';
import { Shape } from '../model/Shape';
import { formatNumber } from '../util/NumberFormat';

/** move：增量平移；作用于容器时由容器递归到子孙。 */
export class MoveCommand extends EditCommand {
  private readonly target: Shape;
  private readonly dx: number;
  private readonly dy: number;

  constructor(document: Document, target: Shape, dx: number, dy: number) {
    super(document);
    this.target = target;
    this.dx = dx;
    this.dy = dy;
  }

  override execute(): string {
    return this.apply(this.dx, this.dy, 'moved');
  }

  override undo(): string {
    return this.apply(-this.dx, -this.dy, 'moved back');
  }

  private apply(dx: number, dy: number, verb: string): string {
    this.target.move(dx, dy);
    const anchor = this.target.anchor();
    if (anchor === null) {
      return `${this.target.label()} ${verb} by (${formatNumber(dx)},${formatNumber(dy)})`;
    }
    return `${this.target.label()} ${verb} to (${formatNumber(anchor.x)},${formatNumber(anchor.y)})`;
  }
}
