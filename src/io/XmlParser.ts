export interface XmlNode {
  name: string;
  attributes: Record<string, string>;
  children: XmlNode[];
  text: string;
}

/**
 * 极简 XML 解析：只覆盖 SVG 需要的子集（元素 / 属性 / 文本 / 注释 / 自闭合）。
 * 不引入第三方依赖，保证 read 命令零外部依赖可用。
 */
export class XmlParser {
  private readonly src: string;
  private pos = 0;

  constructor(source: string) {
    this.src = source;
  }

  /** 解析出根元素；结构不合法时抛 Error。 */
  parse(): XmlNode {
    this.skipPreamble();
    if (this.src[this.pos] !== '<') {
      throw new Error('no root element');
    }
    return this.parseElement();
  }

  private skipPreamble(): void {
    for (;;) {
      this.skipWhitespace();
      if (this.startsWith('<?')) {
        this.skipPast('?>');
      } else if (this.startsWith('<!--')) {
        this.skipPast('-->');
      } else if (this.startsWith('<!')) {
        this.skipPast('>');
      } else {
        return;
      }
    }
  }

  private parseElement(): XmlNode {
    this.expect('<');
    const name = this.readName();
    const attributes: Record<string, string> = {};
    for (;;) {
      this.skipWhitespace();
      if (this.startsWith('/>')) {
        this.pos += 2;
        return { name, attributes, children: [], text: '' };
      }
      if (this.src[this.pos] === '>') {
        this.pos += 1;
        break;
      }
      if (this.pos >= this.src.length) {
        throw new Error(`unclosed element <${name}>`);
      }
      const attrName = this.readName();
      this.skipWhitespace();
      let value = '';
      if (this.src[this.pos] === '=') {
        this.pos += 1;
        this.skipWhitespace();
        value = this.readQuoted();
      }
      attributes[attrName] = value;
    }

    const children: XmlNode[] = [];
    let text = '';
    for (;;) {
      if (this.pos >= this.src.length) {
        throw new Error(`unclosed element <${name}>`);
      }
      if (this.startsWith('</')) {
        this.pos += 2;
        this.skipWhitespace();
        this.readName();
        this.skipWhitespace();
        if (this.src[this.pos] === '>') this.pos += 1;
        break;
      }
      if (this.startsWith('<!--')) {
        this.skipPast('-->');
        continue;
      }
      if (this.startsWith('<![CDATA[')) {
        text += this.src.slice(this.pos + 9, this.src.indexOf(']]>', this.pos));
        this.skipPast(']]>');
        continue;
      }
      if (this.src[this.pos] === '<') {
        children.push(this.parseElement());
        continue;
      }
      const next = this.src.indexOf('<', this.pos);
      const chunk = next < 0 ? this.src.slice(this.pos) : this.src.slice(this.pos, next);
      text += chunk;
      this.pos = next < 0 ? this.src.length : next;
    }

    return { name, attributes, children, text: text.trim() };
  }

  private startsWith(token: string): boolean {
    return this.src.startsWith(token, this.pos);
  }

  private skipPast(token: string): void {
    const at = this.src.indexOf(token, this.pos);
    this.pos = at < 0 ? this.src.length : at + token.length;
  }

  private skipWhitespace(): void {
    while (this.pos < this.src.length && /\s/.test(this.src[this.pos])) {
      this.pos += 1;
    }
  }

  private expect(token: string): void {
    if (!this.startsWith(token)) {
      throw new Error(`expected '${token}' at ${this.pos}`);
    }
    this.pos += token.length;
  }

  private readName(): string {
    const start = this.pos;
    while (this.pos < this.src.length && /[^\s/>=]/.test(this.src[this.pos])) {
      this.pos += 1;
    }
    if (start === this.pos) {
      throw new Error(`expected element or attribute name at ${this.pos}`);
    }
    return this.src.slice(start, this.pos);
  }

  private readQuoted(): string {
    const quote = this.src[this.pos];
    if (quote !== '"' && quote !== "'") {
      const start = this.pos;
      while (this.pos < this.src.length && /[^\s>]/.test(this.src[this.pos])) {
        this.pos += 1;
      }
      return this.src.slice(start, this.pos);
    }
    this.pos += 1;
    const end = this.src.indexOf(quote, this.pos);
    if (end < 0) {
      throw new Error('unterminated attribute value');
    }
    const raw = this.src.slice(this.pos, end);
    this.pos = end + 1;
    return raw;
  }
}
