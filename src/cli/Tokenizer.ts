/** 按空白切分命令行；双引号内的空格保留（用于 text 内容），引号本身不保留。 */
export function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quoted = false;
  let hasToken = false;

  for (const ch of line) {
    if (ch === '"') {
      quoted = !quoted;
      hasToken = true;
      continue;
    }
    if (!quoted && /\s/.test(ch)) {
      if (current !== '' || hasToken) {
        tokens.push(current);
        current = '';
        hasToken = false;
      }
      continue;
    }
    current += ch;
    hasToken = true;
  }
  if (current !== '' || hasToken) {
    tokens.push(current);
  }
  return tokens;
}
