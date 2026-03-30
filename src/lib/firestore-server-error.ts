/** Returned to the client when Firestore throws after validation and auth (safe to show in UI). */
export const FIRESTORE_SERVER_ERROR =
  "Could not complete this action. Ensure the server has Firebase Admin credentials (FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON on Vercel). See deployment logs for details." as const;
