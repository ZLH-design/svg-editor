import { ZOrderCommandHandler } from './ZOrderCommandHandler';

/** front <id>：同级置顶。 */
export class FrontCommandHandler extends ZOrderCommandHandler {
  override get name(): string {
    return 'front';
  }

  override get toFront(): boolean {
    return true;
  }

  override get description(): string {
    return '调整 z-order：移到同级最前';
  }
}
