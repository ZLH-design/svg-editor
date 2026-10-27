import { Shape } from './Shape';
import { ShapeParamError } from './ShapeParamError';
import { parseNumber } from '../util/NumberFormat';

/**
 * 图形规格（工厂方法模式里的 Creator）。
 *
 * 一种图形类型 = 一个 ShapeSpec：自带类型名、用法串与"参数 → 实例"的构造逻辑。
 * 内核只按这个接口消费类型，因此新增类型（如插件阶段的 box）只需 register 一个新 Spec。
 */
export abstract class ShapeSpec {
  /** SVG 标签名，也是 create 命令的 `<type>`。 */
  abstract get type(): string;

  /** help 输出的用法串（不含命令名 create）。 */
  abstract get usage(): string;

  /** 由位置参数构造实例；参数不合法时抛 ShapeParamError。 */
  abstract create(id: string, args: string[]): Shape;

  /** 取第 i 个参数并解析为数字，缺失或非法时报错。 */
  protected numberAt(args: string[], i: number, name: string): number {
    const value = parseNumber(args[i]);
    if (value === null) {
      throw new ShapeParamError(`${this.type}: missing or invalid <${name}> — usage: create ${this.usage}`);
    }
    return value;
  }

  /** 取第 i 个参数作为可选的外观值（颜色等）。 */
  protected optionalAt(args: string[], i: number): string | undefined {
    const raw = args[i];
    return raw === undefined || raw === '' ? undefined : raw;
  }
}
