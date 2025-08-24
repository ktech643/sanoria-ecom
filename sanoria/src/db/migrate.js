import fs from 'fs';
import path from 'path';
import { getDb } from './index.js';
import bcrypt from 'bcryptjs';

const migrationsDir = path.join(process.cwd(), 'src/db/migrations');

function runSQL(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

async function runMigrations() {
  const db = getDb();
  await runSQL(db, 'CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, run_at TEXT)');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    const name = file;
    const row = await new Promise((resolve) => db.get('SELECT name FROM _migrations WHERE name = ?', [name], (e, r) => resolve(r)));
    if (row) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    await runSQL(db, 'BEGIN');
    try {
      await runSQL(db, sql);
      await runSQL(db, `INSERT INTO _migrations(name, run_at) VALUES ("${name}", datetime('now'))`);
      await runSQL(db, 'COMMIT');
      console.log('Ran migration', file);
    } catch (e) {
      await runSQL(db, 'ROLLBACK');
      throw e;
    }
  }
}

async function seedAdmin() {
  const db = getDb();
  const user = await new Promise((resolve) => db.get('SELECT id FROM users WHERE email = ?', ['abcd@gmail.com'], (e, r) => resolve(r)));
  if (!user) {
    const passwordHash = bcrypt.hashSync('11223344', 10);
    await new Promise((resolve, reject) => db.run('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', ['Admin', 'abcd@gmail.com', passwordHash, 'admin'], (e) => (e ? reject(e) : resolve())));
    console.log('Seeded initial admin user');
  }
}

runMigrations()
  .then(seedAdmin)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });