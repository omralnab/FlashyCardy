import admin from "firebase-admin";

function initAdmin() {
  if (admin.apps.length > 0) return;

  const projectId =
    process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const json = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    let parsed: admin.ServiceAccount;
    try {
      parsed = JSON.parse(json) as admin.ServiceAccount;
    } catch {
      throw new Error(
        "Invalid FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON: must be valid JSON. " +
          "Use the key file from Firebase Console → Project settings → Service accounts → Generate new private key.",
      );
    }
    admin.initializeApp({
      credential: admin.credential.cert(parsed),
      projectId: projectId ?? parsed.projectId,
    });
    return;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) {
    if (!projectId?.trim()) {
      throw new Error(
        "Set FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID when using GOOGLE_APPLICATION_CREDENTIALS.",
      );
    }
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId,
    });
    return;
  }

  throw new Error(
    "Firebase Admin is not configured. Add FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON to .env.local " +
      "(paste the full service account JSON from Firebase → Project settings → Service accounts), " +
      "or set GOOGLE_APPLICATION_CREDENTIALS to a path of that JSON file. " +
      "NEXT_PUBLIC_* keys alone are not enough for the server to read/write Firestore.",
  );
}

export function getFirestoreDb(): FirebaseFirestore.Firestore {
  initAdmin();
  return admin.firestore();
}
