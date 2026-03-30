/**
 * Snapshot for debugging server-side Firestore (no secrets).
 * Visible in Vercel → Deployment → Logs when running on Node.
 */
export function getFirestoreDebugEnv(): Record<string, string | undefined> {
  return {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };
}

/**
 * Log each Firestore-backed query attempt (request time, not build time in SSR mode).
 */
export function logFirestoreOperation(
  kind: "read" | "write",
  operation: string,
  detail?: Record<string, string | undefined>,
): void {
  console.log(
    `[flashycardy][firestore] ${kind} ${operation}`,
    JSON.stringify({ ...getFirestoreDebugEnv(), ...detail }),
  );
}

/**
 * Structured logging for Firestore (Firebase Admin) failures.
 * Visible in Vercel → Deployment → Logs when running on Node.
 */
export function logFirestoreFailure(context: string, error: unknown): void {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : JSON.stringify(error);
  const name = error instanceof Error ? error.name : "Error";
  const stack = error instanceof Error ? error.stack : undefined;
  console.error(
    `[flashycardy][firestore] ${context} | ${name}: ${message}`,
    stack ? `\n${stack}` : error,
  );
}

export function isFirebaseAdminConfigError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes("Firebase Admin is not configured")
  );
}
