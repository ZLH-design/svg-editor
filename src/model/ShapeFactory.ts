import { ShapeSpec } from './ShapeSpec';
import { Shape } from './Shape';
import { RectSpec } from './specs/RectSpec';
import { CircleSpec } from './specs/CircleSpec';
import { EllipseSpec } from './specs/EllipseSpec';
import { LineSpec } from './specs/LineSpec';
import { TextSpec } from './specs/TextSpec';
import { GroupSpec } from './specs/GroupSpec';

/**
 * 图形工厂：类型名 → ShapeSpec 的注册表（"按名字分派"的两处之一）。
 *
 * 内核内置六种类型；插件阶段的 `box` 只要往同一个注册表里 register 一个 ShapeSpec
 * 即可被 create 命令识别，工厂代码无需改动（OCP）。
 */
export class ShapeFactory {
  private readonly _specs = new Map<string, ShapeSpec>();

  constructor() {
    this.register(new RectSpec());
    this.register(new CircleSpec());
    this.register(new EllipseSpec());
    this.register(new LineSpec());
    this.register(new TextSpec());
    this.register(new GroupSpec());
  }

  /** 注册新类型（插件插槽）。 */
  register(spec: ShapeSpec): void {
    this._specs.set(spec.type, spec);
  }

  has(type: string): boolean {
    return this._specs.has(type);
  }

  specOf(type: string): ShapeSpec {
    const spec = this._specs.get(type);
    if (spec === undefined) {
      throw new Error(`unregistered shape type: ${type}`);
    }
    return spec;
  }

  /** help 输出用的全部类型用法串。 */
  usages(): string[] {
    return Array.from(this._specs.values()).map((spec) => spec.usage);
  }

  create(type: string, id: string, args: string[]): Shape {
    return this.specOf(type).create(id, args);
  }
}
