import { formatNumber } from '../util/NumberFormat';

/**
 * 外观属性（fill / stroke / stroke-width）的封装。
 * 所有图形共享同一套外观属性语义，因此以组合而非继承的方式复用。
 */
export class PaintStyle {
  private _fill: string | null = null;
  private _stroke: string | null = null;
  private _strokeWidth: string | null = null;

  get fill(): string | null {
    return this._fill;
  }

  get stroke(): string | null {
    return this._stroke;
  }

  get strokeWidth(): string | null {
    return this._strokeWidth;
  }

  /** 尝试设置一个外观属性；不在白名单内返回 false。 */
  set(name: string, value: string): boolean {
    switch (name) {
      case 'fill':
        this._fill = value;
        return true;
      case 'stroke':
        this._stroke = value;
        return true;
      case 'stroke-width':
        this._strokeWidth = value;
        return true;
      default:
        return false;
    }
  }

  /** 读取属性当前值（用于 undo 时保存旧值）。 */
  get(name: string): string | null {
    switch (name) {
      case 'fill':
        return this._fill;
      case 'stroke':
        return this._stroke;
      case 'stroke-width':
        return this._strokeWidth;
      default:
        return null;
    }
  }

  /** 该属性名是否属于外观属性白名单。 */
  static handles(name: string): boolean {
    return name === 'fill' || name === 'stroke' || name === 'stroke-width';
  }

  /** 清除一个外观属性（set 的 undo 用），不在白名单内返回 false。 */
  remove(name: string): boolean {
    switch (name) {
      case 'fill':
        this._fill = null;
        return true;
      case 'stroke':
        this._stroke = null;
        return true;
      case 'stroke-width':
        this._strokeWidth = null;
        return true;
      default:
        return false;
    }
  }

  /** 序列化用的属性表（未设置的属性不写出）。 */
  entries(): Array<[string, string]> {
    const out: Array<[string, string]> = [];
    if (this._fill !== null) out.push(['fill', this._fill]);
    if (this._stroke !== null) out.push(['stroke', this._stroke]);
    if (this._strokeWidth !== null) out.push(['stroke-width', this._strokeWidth]);
    return out;
  }

  /** tree 行尾的内联摘要片段。 */
  summaryParts(): string[] {
    return this.entries().map(([k, v]) => `${k}=${v}`);
  }

  clone(): PaintStyle {
    const copy = new PaintStyle();
    if (this._fill !== null) copy.set('fill', this._fill);
    if (this._stroke !== null) copy.set('stroke', this._stroke);
    if (this._strokeWidth !== null) copy.set('stroke-width', this._strokeWidth);
    return copy;
  }
}

/** 把数值格式化为字符串（供各图形复用）。 */
export function num(value: number): string {
  return formatNumber(value);
}
