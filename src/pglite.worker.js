import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';

worker({
  async init() {
    const db = new PGlite({
      //  dataDir: 'idb://my-database', //  <-  Important: You can set dataDir here, or in the main thread.  It's more common to set it in the main thread.
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dob TEXT,
        gender TEXT,
        contact TEXT,
        address TEXT,
        disease TEXT
      )
    `);
    return db;
  },
});
