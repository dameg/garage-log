export class ConflictError extends Error {
  readonly code = 'CONFLICT';
  constructr(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
