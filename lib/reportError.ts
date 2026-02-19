

/* import * as Sentry from "@sentry/nextjs"; */

type Context = Record<string, unknown>;

/**
 * Report an error to Sentry (production) or console (development).
 * Safe to call from both server and client components.
 */
export function reportError(error: unknown, context?: Context): void {
  if (process.env.NODE_ENV !== "production") {
    console.error("[DEV ERROR]", error, context);
    return;
  }

/*   Sentry.withScope((scope) => {
    if (context) scope.setExtras(context);
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(String(error), "error");
    }
  }); */
} 