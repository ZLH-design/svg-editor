/** 数字格式化：整数不带小数点，小数最多保留 3 位并去掉尾随 0。 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}

/** 解析数值参数，失败时返回 null（由调用方决定报错文本）。 */
export function parseNumber(raw: string): number | null {
  if (raw === undefined || raw.trim() === '') {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}
