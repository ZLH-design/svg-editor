/**
 * 命令执行期错误：message 即为 `error:` 之后要输出给用户的文本。
 * 放在 shared 层，命令层与 CLI 层都可以抛/接，不产生 cli → model 的反向依赖。
 */
export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliError';
  }
}
