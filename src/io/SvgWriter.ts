import { Document } from '../model/Document';
import { Shape } from '../model/Shape';
import { GroupShape } from '../model/shapes/GroupShape';
import { escapeXml, unescapeXml } from '../util/XmlEscape';
import { formatNumber } from '../util/NumberFormat';

/** Document → SVG 文本。 */
export class SvgWriter {
  serialize(document: Document): string {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${formatNumber(document.width)}" ` +
        `height="${formatNumber(document.height)}" viewBox="0 0 ${formatNumber(document.width)} ${formatNumber(document.height)}">`,
    );
    for (const child of document.root.children) {
      this.writeShape(child, 1, lines);
    }
    lines.push('</svg>');
    return lines.join('\n') + '\n';
  }

  private writeShape(shape: Shape, depth: number, out: string[]): void {
    const indent = '  '.repeat(depth);
    const attrs = this.attributeText(shape);
    const hasChildren = shape.isContainer() && (shape as GroupShape).childCount() > 0;
    const text = shape.textContent();

    if (hasChildren) {
      out.push(`${indent}<${shape.type} ${attrs}>`);
      for (const child of (shape as GroupShape).children) {
        this.writeShape(child, depth + 1, out);
      }
      out.push(`${indent}</${shape.type}>`);
    } else if (text !== null) {
      out.push(`${indent}<${shape.type} ${attrs}>${escapeXml(text)}</${shape.type}>`);
    } else {
      out.push(`${indent}<${shape.type} ${attrs}/>`);
    }
  }

  private attributeText(shape: Shape): string {
    const parts = [`id="${escapeXml(shape.id)}"`];
    for (const [name, value] of shape.svgAttributes()) {
      parts.push(`${name}="${escapeXml(value)}"`);
    }
    for (const [name, value] of shape.extraAttributes()) {
      parts.push(`${name}="${escapeXml(unescapeXml(value))}"`);
    }
    return parts.join(' ');
  }
}
