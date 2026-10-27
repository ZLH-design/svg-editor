/** 图形参数错误：由图形规格（ShapeSpec）在参数不合法时抛出，CLI 层负责转成 `error:` 输出。 */
export class ShapeParamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShapeParamError';
  }
}
