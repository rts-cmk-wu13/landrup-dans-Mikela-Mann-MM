import * as Sentry from "@sentry/nextjs"; 
import { ApiError, NetworkError } from "./errors";

type Context = Record<string, unknown>;

/**
 * Centraliseret fejlrapportering.
 * - Development: console med farvet output og kontekst
 * - Production: Sentry med struktureret kontekst
 */
export function reportError(error: unknown, context?: Context): void {
  const enriched = buildContext(error, context);

  if (process.env.NODE_ENV !== "production") {
    console.error(`\x1b[31m[ERROR] ${enriched.name}: ${enriched.message}\x1b[0m`, enriched);
    return;
  }

   Sentry.withScope((scope) => {
    scope.setExtras(enriched);
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(String(error), "error");
    }
  });
} 
 
function buildContext(error: unknown, extra?: Context): Record<string, unknown> {
  const base: Record<string, unknown> = { ...extra };

  if (error instanceof ApiError) {
    base.name    = error.name;
    base.message = error.message;
    base.status  = error.status;
    base.path    = error.path;
  } else if (error instanceof NetworkError) {
    base.name    = error.name;
    base.message = error.message;
    base.cause   = String(error.cause ?? "ukendt");
  } else if (error instanceof Error) {
    base.name    = error.name;
    base.message = error.message;
  } else {
    base.name    = "UnknownError";
    base.message = String(error);
  }

  return base;
}