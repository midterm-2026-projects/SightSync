// Centralized error class para sa validation o database constraint failures
class ConstraintError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ConstraintError';
    this.statusCode = 400; // Kadalasang 400 Bad Request para sa mga constraint violations
    this.cause = cause;
  }
}

// Centralized error handler - pinapanatiling malinis ang mga controllers at consistent ang responses
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${err.name || 'Error'} (${statusCode}) - ${message}`);
    if (err.cause) {
      console.error(`[Cause]`, err.cause);
    }
  }

  res.status(statusCode).json({ error: message });
}

// Pinagsamang exports gamit ang ES Modules syntax
export { ConstraintError, errorHandler };
export default errorHandler;