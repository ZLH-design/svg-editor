import { GroupShape } from './shapes/GroupShape';
import { PaintStyle } from './PaintStyle';

/** show 输出里的一行属性组。 */
export interface DetailLine {
  text: string;
}

/**
 * 图形基类（Composite 模式的 Component）。
 *
 * 子类只需回答"自己是什么、怎么平移/缩放、怎么序列化"，
 * 树结构与 id 索引由 Document 统一维护，命令层无需关心具体类型。
 */
export abstract class Shape {
  private readonly _id: string;
  private _parent: GroupShape | null = null;
  private readonly _extra = new Map<string, string>();

  protected constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  get parent(): GroupShape | null {
    return this._parent;
  }

  /** 由 Document / Command 在挂树时调用，外部不应直接改 parent。 */
  attachTo(parent: GroupShape | null): void {
    this._parent = parent;
  }

  /** SVG 标签名（rect / circle / … / g / svg）。 */
  abstract get type(): string;

  /** tree / show 中使用的显示名（type#id）。 */
  label(): string {
    return `${this.type}#${this.id}`;
  }

  isContainer(): boolean {
    return false;
  }

  /** 平移（增量）。容器负责递归到子孙。 */
  abstract move(dx: number, dy: number): void;

  /** 等比缩放：位置与尺寸同乘 factor。容器负责递归到子孙。 */
  abstract scale(factor: number): void;

  /** 设置属性，返回 false 表示不在白名单内。 */
  abstract setAttribute(name: string, value: string): boolean;

  /** 该属性是否可写（set 白名单；各类型的几何属性由子类追加）。 */
  supportsAttribute(name: string): boolean {
    return PaintStyle.handles(name);
  }

  /** 清除属性（set 的 undo 用），基类只处理外观属性；几何属性不可清除。 */
  unsetAttribute(name: string): boolean {
    return this._style.remove(name);
  }

  /** 读取属性当前值（字符串形式），不存在返回 null。 */
  abstract getAttribute(name: string): string | null;

  /** tree 行尾的内联几何摘要。 */
  abstract summary(): string;

  /** show 输出的属性明细行（不含缩进）。 */
  abstract detailLines(): string[];

  /** 序列化为 SVG 时需要写出的属性（不含 id）。 */
  abstract svgAttributes(): Array<[string, string]>;

  /** 文本子节点内容（仅 text 有），其余返回 null。 */
  textContent(): string | null {
    return null;
  }

  /** move 成功回显用的锚点坐标；容器（无几何位置）返回 null。 */
  anchor(): { x: number; y: number } | null {
    return null;
  }

  /** 外观属性；由基类统一持有，子类通过它复用 fill / stroke / stroke-width 语义。 */
  get style(): PaintStyle {
    return this._style;
  }

  private readonly _style = new PaintStyle();

  abstract clone(): Shape;

  /** 读回时保留的、当前内核不认识的属性（保证 round-trip 无损）。 */
  extraAttributes(): Array<[string, string]> {
    return Array.from(this._extra.entries());
  }

  setExtraAttribute(name: string, value: string): void {
    if (name === 'id') return;
    if (!this.setAttribute(name, value)) {
      this._extra.set(name, value);
    }
  }

  /** 自身或子树是否包含 target（用于 group / addto 的环检测）。 */
  contains(target: Shape): boolean {
    return this === target;
  }
}
