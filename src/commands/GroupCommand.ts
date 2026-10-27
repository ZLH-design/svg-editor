import { EditCommand } from './EditCommand';
import { Document, Placement } from '../model/Document';
import { GroupShape } from '../model/shapes/GroupShape';
import { Shape } from '../model/Shape';

interface Origin {
  shape: Shape;
  placement: Placement;
}

/** group：新建容器并把若干已存在的图形收编进去（各自从原父容器摘出，保持相对顺序）。 */
export class GroupCommand extends EditCommand {
  private readonly group: GroupShape;
  private readonly origins: Origin[] = [];

  constructor(document: Document, groupId: string, targets: Shape[]) {
    super(document);
    this.group = new GroupShape(groupId);
    for (const target of targets) {
      this.origins.push({ shape: target, placement: { parent: target.parent as GroupShape, index: -1 } });
    }
  }

  override execute(): string {
    for (const origin of this.origins) {
      origin.placement = this.document.detach(origin.shape);
    }
    const first = this.origins[0].placement;
    this.document.insertChild(first.parent, this.group, first.index);
    for (const origin of this.origins) {
      this.document.insertChild(this.group, origin.shape);
    }
    return `${this.group.label()} created with ${this.origins.length} children`;
  }

  override undo(): string {
    for (const origin of this.origins) {
      this.document.detach(origin.shape);
    }
    this.document.detach(this.group);
    const restored = this.origins.slice().sort((a, b) => a.placement.index - b.placement.index);
    for (const origin of restored) {
      this.document.insertChild(origin.placement.parent, origin.shape, origin.placement.index);
    }
    return `${this.group.label()} dissolved, ${this.origins.length} children restored`;
  }
}
