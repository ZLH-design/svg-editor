import { ShapeSpec } from '../ShapeSpec';
import { Shape } from '../Shape';
import { GroupShape } from '../shapes/GroupShape';

/** g: create g <id>（空容器，之后用 addto / in 子句填充） */
export class GroupSpec extends ShapeSpec {
  override get type(): string {
    return 'g';
  }

  override get usage(): string {
    return 'g <id>';
  }

  override create(id: string, _args: string[]): Shape {
    return new GroupShape(id);
  }
}
