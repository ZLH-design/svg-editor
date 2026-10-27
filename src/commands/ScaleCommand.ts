import { EditCommand } from './EditCommand';
import { Document } from '../model/Document';
import { Shape } from '../model/Shape';
import { formatNumber } from '../util/NumberFormat';

/** scale：等比缩放（位置与尺寸同乘）；作用于容器时递归到每个子孙。 */
export class ScaleCommand extends EditCommand {
  private readonly target: Shape;
  private readonly factor: number;

  constructor(document: Document, target: Shape, factor: number) {
    super(document);
    this.target = target;
    this.factor = factor;
  }

  override execute(): string {
    this.target.scale(this.factor);
    return `${this.target.label()} scaled by ${formatNumber(this.factor)}`;
  }

  override undo(): string {
    const inverse = 1 / this.factor;
    this.target.scale(inverse);
    return `${this.target.label()} scaled back by ${formatNumber(inverse)}`;
  }
}
