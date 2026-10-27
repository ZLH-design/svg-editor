import { EditCommand } from './EditCommand';
import { Document, Placement } from '../model/Document';
import { Shape } from '../model/Shape';

/** front / back：同级 z-order 调整（front 移到末尾，back 移到最前）。 */
export class ZOrderCommand extends EditCommand {
  private readonly target: Shape;
  private readonly toFront: boolean;
  private origin: Placement | null = null;

  constructor(document: Document, target: Shape, toFront: boolean) {
    super(document);
    this.target = target;
    this.toFront = toFront;
  }

  override execute(): string {
    this.origin = this.document.detach(this.target);
    const index = this.toFront ? this.origin.parent.childCount() : 0;
    this.document.insertChild(this.origin.parent, this.target, index);
    return `${this.target.label()} moved to ${this.toFront ? 'front' : 'back'}`;
  }

  override undo(): string {
    if (this.origin === null) {
      return `${this.target.label()} already restored`;
    }
    this.document.detach(this.target);
    this.document.insertChild(this.origin.parent, this.target, this.origin.index);
    const position = this.origin.index + 1;
    this.origin = null;
    return `${this.target.label()} restored to position ${position}`;
  }
}
