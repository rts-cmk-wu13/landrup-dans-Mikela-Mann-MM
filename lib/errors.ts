/**
 * Custom error classes for API error classification.
 * Giver Sentry og udvikleren præcis kontekst om hvad der gik galt.
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthError extends ApiError {
  constructor(path: string) {
    super(401, path, "Ikke autoriseret — token mangler eller er udløbet");
    this.name = "AuthError";
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(404, path, `Ressource ikke fundet: ${path}`);
    this.name = "NotFoundError";
  }
}

export class ServerError extends ApiError {
  constructor(status: number, path: string, message: string) {
    super(status, path, message);
    this.name = "ServerError";
  }
}

export class NetworkError extends Error {
  constructor(path: string, cause?: unknown) {
    super(`Netværksfejl ved kald til ${path}`);
    this.name = "NetworkError";
    this.cause = cause;
  }
}