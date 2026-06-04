import { openDB } from 'idb';

const DB_NAME = 'job-tracker-db';
const STORE   = 'jobs';
const VERSION = 1;

export const KANBAN_COLUMNS = {
  saved:     'Saved',
  applied:   'Applied',
  followUp:  'Follow-Up',
  interview: 'Interview',
  offer:     'Offer / Rejected',
};

let dbPromise = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllJobs() {
  const db = await getDB();
  return db.getAll(STORE);
}

export async function addJob(job) {
  const db = await getDB();
  return db.add(STORE, { ...job, dateAdded: new Date().toISOString() });
}

export async function updateJob(job) {
  const db = await getDB();
  return db.put(STORE, job);
}

export async function deleteJob(id) {
  const db = await getDB();
  return db.delete(STORE, id);
}
