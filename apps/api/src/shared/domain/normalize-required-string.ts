import { DomainError } from '../errors/domain-error';

export function normalizeRequiredString(label: string, value: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new DomainError(`${label} cannot be empty`);
  }

  return normalized;
}
