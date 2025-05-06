// src/db.js
import { PGlite } from '@electric-sql/pglite'
import PGWorker from './worker.js?worker'

let db

export const getDB = async () => {
  if (db) return db

  // Fetch and compile WASM once
  const response = await fetch('/pglite.wasm')
  const wasmBuffer = await response.arrayBuffer()
  const wasmModule = await WebAssembly.compile(wasmBuffer)

  db = new PGlite({
    worker: new PGWorker({
      type: 'module',
      name: 'pglite-worker',
      wasm: wasmModule,
    }),
  })

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
  `)

  return db
}
