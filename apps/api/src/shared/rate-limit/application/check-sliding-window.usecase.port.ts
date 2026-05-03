import type {
  HitSlidingWindowParams,
  HitSlidingWindowResult,
} from '../contracts/sliding-window.repository';

export type CheckSlidingWindowUseCasePort = {
  execute(params: HitSlidingWindowParams): Promise<HitSlidingWindowResult>;
};
