import { Document } from '../model/Document';
import { ShapeFactory } from '../model/ShapeFactory';
import { Shape } from '../model/Shape';
import { GroupShape } from '../model/shapes/GroupShape';
import { XmlNode, XmlParser } from './XmlParser';
import { unescapeXml } from '../util/XmlEscape';

/** 读入结果：文档本身 + 需要提示给用户的警告（如自动补 id）。 */
export interface ReadResult {
  document: Document;
  warnings: string[];
}

/** SVG 文件 → Document。 */
export class SvgReader {
  private readonly factory: ShapeFactory;

  constructor(factory: ShapeFactory) {
    this.factory = factory;
  }

  parse(source: string): ReadResult {
    const root = new XmlParser(source).parse();
    if (root.name !== 'svg') {
      throw new Error('root element is not <svg>');
    }
    const document = new Document(
      this.parseLength(root.attributes['width'], 800),
      this.parseLength(root.attributes['height'], 600),
    );
    const warnings: string[] = [];
    const counters = new Map<string, number>();
    for (const child of root.children) {
      const shape = this.convert(child, document, warnings, counters);
      if (shape !== null) {
        document.insertChild(document.root, shape);
      }
    }
    return { document, warnings };
  }

  private convert(
    node: XmlNode,
    document: Document,
    warnings: string[],
    counters: Map<string, number>,
  ): Shape | null {
    if (!this.factory.has(node.name)) {
      return null;
    }
    const id = this.resolveId(node, document, warnings, counters);
    const shape = this.factory.create(node.name, id, this.argsOf(node));
    for (const [name, raw] of Object.entries(node.attributes)) {
      if (name === 'id') continue;
      shape.setExtraAttribute(name, unescapeXml(raw));
    }
    if (shape.isContainer()) {
      const group = shape as GroupShape;
      for (const child of node.children) {
        const converted = this.convert(child, document, warnings, counters);
        if (converted !== null) {
          group.append(converted);
        }
      }
    }
    return shape;
  }

  /** 缺 id 时按 `标签名+序号` 分配并记警告。 */
  private resolveId(
    node: XmlNode,
    document: Document,
    warnings: string[],
    counters: Map<string, number>,
  ): string {
    const raw = node.attributes['id'];
    if (raw !== undefined && raw !== '') {
      return raw;
    }
    let seq = counters.get(node.name) ?? 0;
    let candidate = `${node.name}${seq + 1}`;
    while (document.has(candidate)) {
      seq += 1;
      candidate = `${node.name}${seq + 1}`;
    }
    counters.set(node.name, seq + 1);
    warnings.push(`warning: assigned id ${candidate} to unnamed <${node.name}>`);
    return candidate;
  }

  /** 把 XML 属性整理成 ShapeSpec 需要的位置参数。 */
  private argsOf(node: XmlNode): string[] {
    const a = node.attributes;
    switch (node.name) {
      case 'rect':
        return [a['x'] ?? '0', a['y'] ?? '0', a['width'] ?? '0', a['height'] ?? '0'];
      case 'circle':
        return [a['cx'] ?? '0', a['cy'] ?? '0', a['r'] ?? '0'];
      case 'ellipse':
        return [a['cx'] ?? '0', a['cy'] ?? '0', a['rx'] ?? '0', a['ry'] ?? '0'];
      case 'line':
        return [a['x1'] ?? '0', a['y1'] ?? '0', a['x2'] ?? '0', a['y2'] ?? '0'];
      case 'text':
        return [a['x'] ?? '0', a['y'] ?? '0', unescapeXml(node.text ?? '')];
      default:
        return [];
    }
  }

  private parseLength(raw: string | undefined, fallback: number): number {
    if (raw === undefined) return fallback;
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : fallback;
  }
}
