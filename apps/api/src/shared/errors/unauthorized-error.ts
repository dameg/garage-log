export class UnauthorizedError extends Error {
  readonly code = 'UNAUTHORIZED';

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
