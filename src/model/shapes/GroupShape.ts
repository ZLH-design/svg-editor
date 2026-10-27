import { Shape } from '../Shape';

/**
 * <g> 容器（Composite 模式的 Composite）。
 * 文档根也是一个 GroupShape（type='svg'），因此"容器与叶子统一操作"在根上同样成立。
 */
export class GroupShape extends Shape {
  private readonly _children: Shape[] = [];
  private readonly _kind: string;

  constructor(id: string, kind = 'g') {
    super(id);
    this._kind = kind;
  }

  override get type(): string {
    return this._kind;
  }

  override isContainer(): boolean {
    return true;
  }

  get children(): ReadonlyArray<Shape> {
    return this._children;
  }

  childCount(): number {
    return this._children.length;
  }

  childAt(index: number): Shape {
    return this._children[index];
  }

  indexOf(child: Shape): number {
    return this._children.indexOf(child);
  }

  /** 在末尾追加子节点（不负责维护 id 索引，索引由 Document 统一处理）。 */
  append(child: Shape): void {
    this._children.push(child);
    child.attachTo(this);
  }

  /** 在指定位置插入子节点。 */
  insertAt(index: number, child: Shape): void {
    this._children.splice(index, 0, child);
    child.attachTo(this);
  }

  /** 摘出子节点（不负责维护 id 索引）。 */
  remove(child: Shape): number {
    const index = this._children.indexOf(child);
    if (index >= 0) {
      this._children.splice(index, 1);
      child.attachTo(null);
    }
    return index;
  }

  /** 摘出指定位置的子节点。 */
  removeAt(index: number): Shape {
    const child = this._children[index];
    this._children.splice(index, 1);
    child.attachTo(null);
    return child;
  }

  override move(dx: number, dy: number): void {
    for (const child of this._children) child.move(dx, dy);
  }

  override scale(factor: number): void {
    for (const child of this._children) child.scale(factor);
  }

  override setAttribute(name: string, value: string): boolean {
    return this.style.set(name, value);
  }

  override getAttribute(name: string): string | null {
    return this.style.get(name);
  }

  override summary(): string {
    return this.style.summaryParts().join(' ');
  }

  override detailLines(): string[] {
    const styleLine = this.style.summaryParts().join(' ');
    return styleLine === '' ? [] : [styleLine];
  }

  override svgAttributes(): Array<[string, string]> {
    return this.style.entries();
  }

  override contains(target: Shape): boolean {
    if (this === target) return true;
    for (const child of this._children) {
      if (child.contains(target)) return true;
    }
    return false;
  }

  override clone(): GroupShape {
    const copy = new GroupShape(this.id, this._kind);
    for (const [name, value] of this.style.entries()) copy.style.set(name, value);
    for (const child of this._children) copy.append(child.clone());
    return copy;
  }
}
