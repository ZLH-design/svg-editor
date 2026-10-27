import { Shape } from '../Shape';
import { num } from '../PaintStyle';

/** <line>：x1 / y1 / x2 / y2。 */
export class LineShape extends Shape {
  private _x1: number;
  private _y1: number;
  private _x2: number;
  private _y2: number;

  constructor(
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stroke?: string,
  ) {
    super(id);
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    if (stroke !== undefined) this.style.set('stroke', stroke);
  }

  override get type(): string {
    return 'line';
  }

  override supportsAttribute(name: string): boolean {
    return ['x1', 'y1', 'x2', 'y2'].includes(name) || super.supportsAttribute(name);
  }

  override move(dx: number, dy: number): void {
    this._x1 += dx;
    this._y1 += dy;
    this._x2 += dx;
    this._y2 += dy;
  }

  override scale(factor: number): void {
    this._x1 *= factor;
    this._y1 *= factor;
    this._x2 *= factor;
    this._y2 *= factor;
  }

  override setAttribute(name: string, value: string): boolean {
    const n = Number(value);
    switch (name) {
      case 'x1':
        if (!Number.isFinite(n)) return false;
        this._x1 = n;
        return true;
      case 'y1':
        if (!Number.isFinite(n)) return false;
        this._y1 = n;
        return true;
      case 'x2':
        if (!Number.isFinite(n)) return false;
        this._x2 = n;
        return true;
      case 'y2':
        if (!Number.isFinite(n)) return false;
        this._y2 = n;
        return true;
      default:
        return this.style.set(name, value);
    }
  }

  override getAttribute(name: string): string | null {
    switch (name) {
      case 'x1':
        return num(this._x1);
      case 'y1':
        return num(this._y1);
      case 'x2':
        return num(this._x2);
      case 'y2':
        return num(this._y2);
      default:
        return this.style.get(name);
    }
  }

  /** tree 内联格式与 spec 6.1 一致：只显示两个端点。 */
  override summary(): string {
    return `(${num(this._x1)},${num(this._y1)}) -> (${num(this._x2)},${num(this._y2)})`;
  }

  override detailLines(): string[] {
    const lines = [
      `x1=${num(this._x1)} y1=${num(this._y1)} x2=${num(this._x2)} y2=${num(this._y2)}`,
    ];
    const styleLine = this.style.summaryParts().join(' ');
    if (styleLine !== '') lines.push(styleLine);
    return lines;
  }

  override svgAttributes(): Array<[string, string]> {
    const attributes: Array<[string, string]> = [
      ['x1', num(this._x1)],
      ['y1', num(this._y1)],
      ['x2', num(this._x2)],
      ['y2', num(this._y2)],
    ];
    return attributes.concat(this.style.entries());
  }

  override anchor(): { x: number; y: number } {
    return { x: this._x1, y: this._y1 };
  }

  override clone(): LineShape {
    const copy = new LineShape(this.id, this._x1, this._y1, this._x2, this._y2);
    for (const [name, value] of this.style.entries()) copy.style.set(name, value);
    return copy;
  }
}
