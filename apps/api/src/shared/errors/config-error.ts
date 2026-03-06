export class ConfigError extends Error {
  readonly code = 'CONFIG_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}
