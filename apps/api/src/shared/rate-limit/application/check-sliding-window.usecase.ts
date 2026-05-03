import type {
  HitSlidingWindowParams,
  HitSlidingWindowResult,
  SlidingWindowRepository,
} from '../contracts/sliding-window.repository';

export class CheckSlidingWindowUseCase {
  constructor(private readonly repo: SlidingWindowRepository) {}

  async execute(params: HitSlidingWindowParams): Promise<HitSlidingWindowResult> {
    return this.repo.hit({
      ...params,
      nowMs: params.nowMs ?? Date.now(),
    });
  }
}
