import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getDB } from './db'

import { PGlite } from '@electric-sql/pglite'
import PGWorker from './worker.js?worker' // Import worker

function App() {
  const [patients, setPatients] = useState([])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const db = await getDB()

        // Optional: insert sample patients only if table is empty
        const result = await db.exec('SELECT * FROM patients')
        if (result[0].rows.length === 0) {
          await db.exec(`
            INSERT INTO patients (name, dob, gender, contact, address, disease)
            VALUES 
              ('Alice', '1990-01-01', 'Female', '1234567890', 'Bangalore', 'Flu'),
              ('Bob', '1985-05-10', 'Male', '9876543210', 'Hyderabad', 'Cold')
          `)
        }

        const resultAfterInsert = await db.exec('SELECT * FROM patients')
        setPatients(resultAfterInsert[0].rows)
      } catch (error) {
        console.error('Error loading patient data:', error)
      }
    }

    fetchPatients()
  }, [])

  return (
    <div>
      <h1>Patient Records</h1>
      <ul>
        {patients.length > 0 ? (
          patients.map((p) => (
            <li key={p.id}>
              {p.name} - {p.disease}
            </li>
          ))
        ) : (
          <p>No patient records found.</p>
        )}
      </ul>
    </div>
  )
}

export default App
