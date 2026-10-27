import { EditCommand } from './EditCommand';
import { Document } from '../model/Document';
import { GroupShape } from '../model/shapes/GroupShape';
import { Shape } from '../model/Shape';
import { Placement } from '../model/Document';

/** create：把已构造好的图形挂进父容器（容器由 `in` 子句指定，缺省为画布根）。 */
export class CreateCommand extends EditCommand {
  private readonly shape: Shape;
  private readonly parent: GroupShape;
  private placement: Placement | null = null;

  constructor(document: Document, shape: Shape, parent: GroupShape) {
    super(document);
    this.shape = shape;
    this.parent = parent;
  }

  override execute(): string {
    this.document.insertChild(this.parent, this.shape);
    this.placement = { parent: this.parent, index: this.parent.indexOf(this.shape) };
    const where = this.document.isRoot(this.parent) ? '' : ` in ${this.parent.label()}`;
    return `${this.shape.label()} created${where}`;
  }

  override undo(): string {
    if (this.placement !== null) {
      this.document.detach(this.shape);
      this.placement = null;
    }
    return `${this.shape.label()} removed`;
  }
}
