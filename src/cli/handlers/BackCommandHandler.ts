import { ZOrderCommandHandler } from './ZOrderCommandHandler';

/** back <id>：同级置底。 */
export class BackCommandHandler extends ZOrderCommandHandler {
  override get name(): string {
    return 'back';
  }

  override get toFront(): boolean {
    return false;
  }

  override get description(): string {
    return '调整 z-order：移到同级最后';
  }
}
