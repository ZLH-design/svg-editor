import { Shape } from '../Shape';
import { num } from '../PaintStyle';

/** <text>：x / y + 文本内容（内容是子文本而非属性）。 */
export class TextShape extends Shape {
  private _x: number;
  private _y: number;
  private _content: string;

  constructor(id: string, x: number, y: number, content: string) {
    super(id);
    this._x = x;
    this._y = y;
    this._content = content;
  }

  override get type(): string {
    return 'text';
  }

  get content(): string {
    return this._content;
  }

  override supportsAttribute(name: string): boolean {
    return ['x', 'y', 'text'].includes(name) || super.supportsAttribute(name);
  }

  override move(dx: number, dy: number): void {
    this._x += dx;
    this._y += dy;
  }

  override scale(factor: number): void {
    this._x *= factor;
    this._y *= factor;
  }

  override setAttribute(name: string, value: string): boolean {
    const n = Number(value);
    switch (name) {
      case 'x':
        if (!Number.isFinite(n)) return false;
        this._x = n;
        return true;
      case 'y':
        if (!Number.isFinite(n)) return false;
        this._y = n;
        return true;
      case 'text':
        this._content = value;
        return true;
      default:
        return this.style.set(name, value);
    }
  }

  override getAttribute(name: string): string | null {
    switch (name) {
      case 'x':
        return num(this._x);
      case 'y':
        return num(this._y);
      case 'text':
        return this._content;
      default:
        return this.style.get(name);
    }
  }

  override summary(): string {
    const parts = [`(${num(this._x)},${num(this._y)}) "${this._content}"`];
    return parts.concat(this.style.summaryParts()).join(' ');
  }

  override detailLines(): string[] {
    const lines = [`x=${num(this._x)} y=${num(this._y)}`, `text="${this._content}"`];
    const styleLine = this.style.summaryParts().join(' ');
    if (styleLine !== '') lines.push(styleLine);
    return lines;
  }

  override svgAttributes(): Array<[string, string]> {
    const attributes: Array<[string, string]> = [['x', num(this._x)], ['y', num(this._y)]];
    return attributes.concat(this.style.entries());
  }

  override textContent(): string | null {
    return this._content;
  }

  override anchor(): { x: number; y: number } {
    return { x: this._x, y: this._y };
  }

  override clone(): TextShape {
    const copy = new TextShape(this.id, this._x, this._y, this._content);
    for (const [name, value] of this.style.entries()) copy.style.set(name, value);
    return copy;
  }
}
