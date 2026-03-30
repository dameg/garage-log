import {
  HitSlidingWindowParams,
  HitSlidingWindowResult,
} from '../domain/sliding-window.repository';

export type CheckSlidingWindowUseCasePort = {
  execute(params: HitSlidingWindowParams): Promise<HitSlidingWindowResult>;
};
