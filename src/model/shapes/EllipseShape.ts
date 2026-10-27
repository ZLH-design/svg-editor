import { Shape } from '../Shape';
import { num } from '../PaintStyle';

/** <ellipse>：cx / cy / rx / ry。 */
export class EllipseShape extends Shape {
  private _cx: number;
  private _cy: number;
  private _rx: number;
  private _ry: number;

  constructor(id: string, cx: number, cy: number, rx: number, ry: number, fill?: string) {
    super(id);
    this._cx = cx;
    this._cy = cy;
    this._rx = rx;
    this._ry = ry;
    if (fill !== undefined) this.style.set('fill', fill);
  }

  override get type(): string {
    return 'ellipse';
  }

  override supportsAttribute(name: string): boolean {
    return ['cx', 'cy', 'rx', 'ry'].includes(name) || super.supportsAttribute(name);
  }

  override move(dx: number, dy: number): void {
    this._cx += dx;
    this._cy += dy;
  }

  override scale(factor: number): void {
    this._cx *= factor;
    this._cy *= factor;
    this._rx *= factor;
    this._ry *= factor;
  }

  override setAttribute(name: string, value: string): boolean {
    const n = Number(value);
    switch (name) {
      case 'cx':
        if (!Number.isFinite(n)) return false;
        this._cx = n;
        return true;
      case 'cy':
        if (!Number.isFinite(n)) return false;
        this._cy = n;
        return true;
      case 'rx':
        if (!Number.isFinite(n)) return false;
        this._rx = n;
        return true;
      case 'ry':
        if (!Number.isFinite(n)) return false;
        this._ry = n;
        return true;
      default:
        return this.style.set(name, value);
    }
  }

  override getAttribute(name: string): string | null {
    switch (name) {
      case 'cx':
        return num(this._cx);
      case 'cy':
        return num(this._cy);
      case 'rx':
        return num(this._rx);
      case 'ry':
        return num(this._ry);
      default:
        return this.style.get(name);
    }
  }

  override summary(): string {
    const parts = [
      `cx=${num(this._cx)}`,
      `cy=${num(this._cy)}`,
      `rx=${num(this._rx)}`,
      `ry=${num(this._ry)}`,
    ];
    return parts.concat(this.style.summaryParts()).join(' ');
  }

  override detailLines(): string[] {
    const lines = [
      `cx=${num(this._cx)} cy=${num(this._cy)} rx=${num(this._rx)} ry=${num(this._ry)}`,
    ];
    const styleLine = this.style.summaryParts().join(' ');
    if (styleLine !== '') lines.push(styleLine);
    return lines;
  }

  override svgAttributes(): Array<[string, string]> {
    const attributes: Array<[string, string]> = [
      ['cx', num(this._cx)],
      ['cy', num(this._cy)],
      ['rx', num(this._rx)],
      ['ry', num(this._ry)],
    ];
    return attributes.concat(this.style.entries());
  }

  override anchor(): { x: number; y: number } {
    return { x: this._cx, y: this._cy };
  }

  override clone(): EllipseShape {
    const copy = new EllipseShape(this.id, this._cx, this._cy, this._rx, this._ry);
    for (const [name, value] of this.style.entries()) copy.style.set(name, value);
    return copy;
  }
}
