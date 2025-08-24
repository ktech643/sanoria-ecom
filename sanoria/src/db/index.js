import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../.data/sanoria.sqlite');

let dbInstance;
export function getDb() {
  if (!dbInstance) {
    sqlite3.verbose();
    dbInstance = new sqlite3.Database(dbPath);
  }
  return dbInstance;
}