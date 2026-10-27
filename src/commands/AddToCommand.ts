import { EditCommand } from './EditCommand';
import { Document, Placement } from '../model/Document';
import { GroupShape } from '../model/shapes/GroupShape';
import { Shape } from '../model/Shape';

/** addto：把已存在的图形移入容器（作为最后一个子节点）。 */
export class AddToCommand extends EditCommand {
  private readonly target: Shape;
  private readonly container: GroupShape;
  private origin: Placement | null = null;

  constructor(document: Document, target: Shape, container: GroupShape) {
    super(document);
    this.target = target;
    this.container = container;
  }

  override execute(): string {
    this.origin = this.document.detach(this.target);
    this.document.insertChild(this.container, this.target);
    return `${this.target.label()} added to ${this.container.label()}`;
  }

  override undo(): string {
    if (this.origin === null) {
      return `${this.target.label()} already restored`;
    }
    this.document.detach(this.target);
    this.document.insertChild(this.origin.parent, this.target, this.origin.index);
    const where = this.document.parentLabelOf(this.target);
    this.origin = null;
    return `${this.target.label()} restored into ${where}`;
  }
}
