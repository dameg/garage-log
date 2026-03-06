export class DomainError extends Error {
  readonly code = 'DOMAIN_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}