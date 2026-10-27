import { EditCommand } from './EditCommand';
import { Document, Placement } from '../model/Document';
import { GroupShape } from '../model/shapes/GroupShape';
import { Shape } from '../model/Shape';

/** ungroup：解散容器，子图形提升到原容器的父级、占据原容器的位置。 */
export class UngroupCommand extends EditCommand {
  private readonly group: GroupShape;
  private readonly children: Shape[];
  private placement: Placement | null = null;

  constructor(document: Document, group: GroupShape) {
    super(document);
    this.group = group;
    this.children = group.children.slice();
  }

  override execute(): string {
    for (const child of this.children) {
      this.group.remove(child);
    }
    this.placement = this.document.detach(this.group);
    this.children.forEach((child, offset) => {
      this.document.insertChild(this.placement!.parent, child, this.placement!.index + offset);
    });
    return `${this.group.label()} ungrouped, ${this.children.length} children lifted to ${this.document.isRoot(this.placement.parent) ? 'svg' : this.placement.parent.label()}`;
  }

  override undo(): string {
    if (this.placement === null) {
      return `${this.group.label()} already restored`;
    }
    for (const child of this.children) {
      this.document.detach(child);
    }
    this.document.insertChild(this.placement.parent, this.group, this.placement.index);
    for (const child of this.children) {
      this.document.insertChild(this.group, child);
    }
    this.placement = null;
    return `${this.group.label()} restored with ${this.children.length} children`;
  }
}
