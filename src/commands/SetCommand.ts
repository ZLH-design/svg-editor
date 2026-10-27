import { EditCommand } from './EditCommand';
import { Document } from '../model/Document';
import { Shape } from '../model/Shape';

/** 需要加引号的值（含空格）在回显里加引号，与 spec 5 的示例一致。 */
function displayValue(value: string): string {
  return value.includes(' ') ? `"${value}"` : value;
}

/** set：设置白名单属性；undo 恢复旧值（旧值为空则清除该属性）。 */
export class SetCommand extends EditCommand {
  private readonly target: Shape;
  private readonly attribute: string;
  private readonly value: string;
  private previous: string | null = null;
  private executed = false;

  constructor(document: Document, target: Shape, attribute: string, value: string) {
    super(document);
    this.target = target;
    this.attribute = attribute;
    this.value = value;
  }

  override execute(): string {
    this.previous = this.target.getAttribute(this.attribute);
    if (!this.target.setAttribute(this.attribute, this.value)) {
      throw new Error(`unknown attribute: ${this.attribute}`);
    }
    this.executed = true;
    return `${this.target.label()} updated: ${this.attribute}=${displayValue(this.value)}`;
  }

  override undo(): string {
    if (!this.executed) {
      return `${this.target.label()} not updated`;
    }
    if (this.previous === null) {
      this.target.unsetAttribute(this.attribute);
      return `${this.target.label()} updated: ${this.attribute} unset`;
    }
    this.target.setAttribute(this.attribute, this.previous);
    return `${this.target.label()} updated: ${this.attribute}=${displayValue(this.previous)}`;
  }
}
