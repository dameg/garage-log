import type { CheckSlidingWindowUseCasePort } from '../application/check-sliding-window.usecase.port';
import type {
  HitSlidingWindowParams,
  HitSlidingWindowResult,
} from '../contracts/sliding-window.repository';

export class SpyCheckSlidingWindowUseCase implements CheckSlidingWindowUseCasePort {
  lastParams: HitSlidingWindowParams | null = null;

  constructor(
    private readonly result: HitSlidingWindowResult = {
      allowed: true,
      count: 1,
      retryAfterSec: 0,
    },
  ) {}

  async execute(params: HitSlidingWindowParams): Promise<HitSlidingWindowResult> {
    this.lastParams = params;
    return this.result;
  }
}
