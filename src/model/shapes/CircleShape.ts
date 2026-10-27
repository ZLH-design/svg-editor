import { Shape } from '../Shape';
import { num } from '../PaintStyle';

/** <circle>：cx / cy / r。 */
export class CircleShape extends Shape {
  private _cx: number;
  private _cy: number;
  private _r: number;

  constructor(id: string, cx: number, cy: number, r: number, fill?: string) {
    super(id);
    this._cx = cx;
    this._cy = cy;
    this._r = r;
    if (fill !== undefined) this.style.set('fill', fill);
  }

  override get type(): string {
    return 'circle';
  }

  override supportsAttribute(name: string): boolean {
    return ['cx', 'cy', 'r'].includes(name) || super.supportsAttribute(name);
  }

  override move(dx: number, dy: number): void {
    this._cx += dx;
    this._cy += dy;
  }

  override scale(factor: number): void {
    this._cx *= factor;
    this._cy *= factor;
    this._r *= factor;
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
      case 'r':
        if (!Number.isFinite(n)) return false;
        this._r = n;
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
      case 'r':
        return num(this._r);
      default:
        return this.style.get(name);
    }
  }

  override summary(): string {
    const parts = [`cx=${num(this._cx)}`, `cy=${num(this._cy)}`, `r=${num(this._r)}`];
    return parts.concat(this.style.summaryParts()).join(' ');
  }

  override detailLines(): string[] {
    const lines = [`cx=${num(this._cx)} cy=${num(this._cy)} r=${num(this._r)}`];
    const styleLine = this.style.summaryParts().join(' ');
    if (styleLine !== '') lines.push(styleLine);
    return lines;
  }

  override svgAttributes(): Array<[string, string]> {
    const attributes: Array<[string, string]> = [
      ['cx', num(this._cx)],
      ['cy', num(this._cy)],
      ['r', num(this._r)],
    ];
    return attributes.concat(this.style.entries());
  }

  override anchor(): { x: number; y: number } {
    return { x: this._cx, y: this._cy };
  }

  override clone(): CircleShape {
    const copy = new CircleShape(this.id, this._cx, this._cy, this._r);
    for (const [name, value] of this.style.entries()) copy.style.set(name, value);
    return copy;
  }
}
