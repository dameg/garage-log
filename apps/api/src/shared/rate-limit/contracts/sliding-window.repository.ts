export type HitSlidingWindowParams = {
  key: string;
  limit: number;
  windowSec: number;
  nowMs?: number;
};

export type HitSlidingWindowResult = {
  allowed: boolean;
  count: number;
  retryAfterSec: number;
};

export interface SlidingWindowRepository {
  hit(params: HitSlidingWindowParams): Promise<HitSlidingWindowResult>;
}
