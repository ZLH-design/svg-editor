import { Shape } from '../Shape';
import { num } from '../PaintStyle';

/** <rect>：x / y / width / height。 */
export class RectShape extends Shape {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  constructor(id: string, x: number, y: number, width: number, height: number, fill?: string) {
    super(id);
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    if (fill !== undefined) this.style.set('fill', fill);
  }

  override get type(): string {
    return 'rect';
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  override supportsAttribute(name: string): boolean {
    return ['x', 'y', 'width', 'height'].includes(name) || super.supportsAttribute(name);
  }

  override move(dx: number, dy: number): void {
    this._x += dx;
    this._y += dy;
  }

  override scale(factor: number): void {
    this._x *= factor;
    this._y *= factor;
    this._width *= factor;
    this._height *= factor;
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
      case 'width':
        if (!Number.isFinite(n)) return false;
        this._width = n;
        return true;
      case 'height':
        if (!Number.isFinite(n)) return false;
        this._height = n;
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
      case 'width':
        return num(this._width);
      case 'height':
        return num(this._height);
      default:
        return this.style.get(name);
    }
  }

  override summary(): string {
    const parts = [
      `x=${num(this._x)}`,
      `y=${num(this._y)}`,
      `w=${num(this._width)}`,
      `h=${num(this._height)}`,
    ];
    return parts.concat(this.style.summaryParts()).join(' ');
  }

  override detailLines(): string[] {
    const lines = [
      `x=${num(this._x)} y=${num(this._y)} width=${num(this._width)} height=${num(this._height)}`,
    ];
    const styleLine = this.style.summaryParts().join(' ');
    if (styleLine !== '') lines.push(styleLine);
    return lines;
  }

  override svgAttributes(): Array<[string, string]> {
    const attributes: Array<[string, string]> = [
      ['x', num(this._x)],
      ['y', num(this._y)],
      ['width', num(this._width)],
      ['height', num(this._height)],
    ];
    return attributes.concat(this.style.entries());
  }

  override anchor(): { x: number; y: number } {
    return { x: this._x, y: this._y };
  }

  override clone(): RectShape {
    const copy = new RectShape(this.id, this._x, this._y, this._width, this._height);
    for (const [name, value] of this.style.entries()) copy.style.set(name, value);
    return copy;
  }
}
