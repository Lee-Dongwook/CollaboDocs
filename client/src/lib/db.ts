import { openDB } from "idb";

const DB_NAME = "collaborative-editor";
const STORE_NAME = "documents";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export const saveDocumentLocally = async (id: string, content: string) => {
  const db = await initDB();
  await db.put(STORE_NAME, { id, content });
};

export const getLocalDocument = async (id: string) => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

export const deleteLocalDocument = async (id: string) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};
