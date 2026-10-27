import { GroupShape } from './shapes/GroupShape';
import { Shape } from './Shape';

/** 一次结构变更的落点记录，供 undo 精确复位。 */
export interface Placement {
  parent: GroupShape;
  index: number;
}

/**
 * 当前文档：画布尺寸 + 图形树 + id 索引。
 *
 * 根是一个 type='svg' 的 GroupShape，因此"容器与叶子统一操作"在整棵树上成立；
 * id 索引由 Document 统一维护，命令层只管结构变更，不需要自己遍历树。
 */
export class Document {
  private readonly _root: GroupShape;
  private readonly _index = new Map<string, Shape>();
  private _width: number;
  private _height: number;
  private _sourcePath: string | null = null;

  constructor(width = 800, height = 600) {
    this._width = width;
    this._height = height;
    this._root = new GroupShape('svg', 'svg');
  }

  get root(): GroupShape {
    return this._root;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  setSize(width: number, height: number): void {
    this._width = width;
    this._height = height;
  }

  get sourcePath(): string | null {
    return this._sourcePath;
  }

  setSourcePath(path: string): void {
    this._sourcePath = path;
  }

  /** 是否已有该 id（根不参与索引）。 */
  has(id: string): boolean {
    return id === this._root.id || this._index.has(id);
  }

  /** 按 id 查找图形，找不到返回 null。 */
  lookup(id: string): Shape | null {
    return this._index.get(id) ?? null;
  }

  /** 图形数量（不含根）。 */
  elementCount(): number {
    return this._index.size;
  }

  isRoot(shape: Shape): boolean {
    return shape === this._root;
  }

  /** 父容器在回显中的名字：根显示为 svg，其余为 g#id。 */
  parentLabelOf(shape: Shape): string {
    const parent = shape.parent;
    if (parent === null || this.isRoot(parent)) {
      return 'svg';
    }
    return parent.label();
  }

  /** 把图形挂到父容器的末尾（或指定位置），并登记整棵子树的 id。 */
  insertChild(parent: GroupShape, child: Shape, index?: number): void {
    if (index === undefined) {
      parent.append(child);
    } else {
      parent.insertAt(index, child);
    }
    this.registerTree(child);
  }

  /** 从当前父容器摘出图形，并注销整棵子树的 id；返回原落点以便 undo。 */
  detach(child: Shape): Placement {
    const parent = child.parent;
    if (parent === null) {
      throw new Error(`shape ${child.id} has no parent`);
    }
    const index = parent.remove(child);
    this.unregisterTree(child);
    return { parent, index };
  }

  private registerTree(shape: Shape): void {
    if (!this.isRoot(shape)) {
      this._index.set(shape.id, shape);
    }
    if (shape.isContainer()) {
      for (const child of (shape as GroupShape).children) {
        this.registerTree(child);
      }
    }
  }

  private unregisterTree(shape: Shape): void {
    if (!this.isRoot(shape)) {
      this._index.delete(shape.id);
    }
    if (shape.isContainer()) {
      for (const child of (shape as GroupShape).children) {
        this.unregisterTree(child);
      }
    }
  }
}
