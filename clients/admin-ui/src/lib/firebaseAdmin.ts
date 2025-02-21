import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";

// Firebase xizmat hisobini yuklash
import serviceAccount from "./adminConfig.json";

// Agar Firebase allaqachon ishga tushirilmagan bo‘lsa, ishga tushiramiz
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: "gs://uz-dev-44892.appspot.com", // TO‘G‘RI bucket nomi
  });
}

const storage = getStorage().bucket();

export { storage };
