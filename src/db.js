// src/db.js
import { PGlite, IdbFs } from '@electric-sql/pglite';
import PGWorker from './worker.js?worker';

let db;

export const getDB = async () => {
  if (db) return db;

  // Fetch and compile WASM once
  const response = await fetch('/pglite.wasm'); // Adjust path if needed
  const wasmBuffer = await response.arrayBuffer();
  const wasmModule = await WebAssembly.compile(wasmBuffer);

  // Use IndexedDB FS by passing the fs option
  const idbFs = new IdbFs('patient-db'); // Choose a name for your IndexedDB database

  db = new PGlite({
    fs: idbFs, // Pass the IdbFs instance
    worker: new PGWorker({
      type: 'module',
      name: 'pglite-worker',
      wasm: wasmModule,
    }),
  });

  // Create patient table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      dob TEXT,
      gender TEXT,
      contact TEXT,
      address TEXT,
      disease TEXT
    )
  `);

  return db;
};
