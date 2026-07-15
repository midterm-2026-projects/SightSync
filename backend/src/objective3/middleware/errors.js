class ConstraintError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ConstraintError';
    this.cause = cause;
  }
}

export { ConstraintError };