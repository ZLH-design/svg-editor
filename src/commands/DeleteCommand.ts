import { EditCommand } from './EditCommand';
import { Document, Placement } from '../model/Document';
import { Shape } from '../model/Shape';

/** delete：连同子孙一起摘出；undo 精确复位到原父容器的原位置。 */
export class DeleteCommand extends EditCommand {
  private readonly target: Shape;
  private placement: Placement | null = null;

  constructor(document: Document, target: Shape) {
    super(document);
    this.target = target;
  }

  override execute(): string {
    this.placement = this.document.detach(this.target);
    return `${this.target.label()} deleted`;
  }

  override undo(): string {
    if (this.placement === null) {
      return `${this.target.label()} already restored`;
    }
    this.document.insertChild(this.placement.parent, this.target, this.placement.index);
    const where = this.document.parentLabelOf(this.target);
    this.placement = null;
    return `${this.target.label()} restored into ${where}`;
  }
}
