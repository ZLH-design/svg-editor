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
 * 同一层的属性列对齐（按该层最长标签补齐），保证脱离画布也能读。
 */
export class TreeRenderer {
  render(document: Document, root: Shape): string[] {
    const rows: Row[] = [];
    this.collect(document, root, 0, true, rows);
    const widths = new Map<number, number>();
    for (const row of rows) {
      widths.set(row.depth, Math.max(widths.get(row.depth) ?? 0, row.label.length));
    }
    return rows.map((row) => this.formatRow(row, rows, widths));
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

  private formatRow(row: Row, rows: Row[], widths: Map<number, number>): string {
    const prefix = this.prefixOf(row, rows);
    const width = widths.get(row.depth) ?? row.label.length;
    const padded = row.label.padEnd(width + 2, ' ');
    const summary = row.summary === '' ? '' : padded + row.summary;
    return (prefix + (summary === '' ? row.label : summary)).trimEnd();
  }

  /** 依据各行祖先的 isLast 标记拼出 ├── / └── / │ 前缀。 */
  private prefixOf(row: Row, rows: Row[]): string {
    const index = rows.indexOf(row);
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
