import { Document } from '../model/Document';
import { Shape } from '../model/Shape';
import { GroupShape } from '../model/shapes/GroupShape';
import { formatNumber } from '../util/NumberFormat';

interface Row {
  depth: number;
  label: string;
  summary: string;
  isLast: boolean;
}

/**
 * tree 输出渲染：结构树 + 内联几何属性。
 * 所有行的属性列对齐到同一列（由「前缀长度 + 标签长度」最大的一行决定，再补 2 个空格，
 * 至少保留 1 个空格），保证脱离画布也能读。
 */
export class TreeRenderer {
  render(document: Document, root: Shape): string[] {
    const rows: Row[] = [];
    this.collect(document, root, 0, true, rows);
    const prefixes = rows.map((_, index) => this.prefixOf(index, rows));
    let column = 0;
    rows.forEach((row, index) => {
      if (row.summary !== '') {
        column = Math.max(column, prefixes[index].length + row.label.length + 2);
      }
    });
    return rows.map((row, index) => {
      const prefix = prefixes[index];
      if (row.summary === '') return prefix + row.label;
      const pad = Math.max(1, column - prefix.length - row.label.length);
      return prefix + row.label + ' '.repeat(pad) + row.summary;
    });
  }

  private collect(
    document: Document,
    shape: Shape,
    depth: number,
    isLast: boolean,
    out: Row[],
  ): void {
    out.push({
      depth,
      label: this.headerOf(document, shape, depth),
      summary: shape.summary(),
      isLast,
    });
    if (shape.isContainer()) {
      const children = (shape as GroupShape).children;
      children.forEach((child, index) => {
        this.collect(document, child, depth + 1, index === children.length - 1, out);
      });
    }
  }

  private headerOf(document: Document, shape: Shape, depth: number): string {
    if (depth === 0 && document.isRoot(shape)) {
      return `svg (${formatNumber(document.width)}x${formatNumber(document.height)})`;
    }
    const kind = shape
      .extraAttributes()
      .filter(([name]) => name === 'data-kind')
      .map(([, value]) => value)[0];
    return kind === undefined ? shape.label() : `${shape.label()} (${kind})`;
  }

  /** 依据各行祖先的 isLast 标记拼出 ├── / └── / │ 前缀。 */
  private prefixOf(index: number, rows: Row[]): string {
    const row = rows[index];
    if (index === 0) return '';
    const ancestors: boolean[] = [];
    let depth = row.depth;
    for (let i = index - 1; i >= 0 && depth > 1; i -= 1) {
      if (rows[i].depth === depth - 1) {
        ancestors.unshift(rows[i].isLast);
        depth -= 1;
      }
    }
    const branch = row.isLast ? '└── ' : '├── ';
    const parents = ancestors
      .map((last) => (last ? '    ' : '│   '))
      .join('');
    return parents + branch;
  }
}
