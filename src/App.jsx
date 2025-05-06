import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getDB } from './db'

import { PGlite } from '@electric-sql/pglite'
import PGWorker from './worker.js?worker' // Import worker

function App() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [disease, setDisease] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await getDB(); // Get the database instance
        const result = await db.exec("SELECT * FROM patients");
        if (result && result[0] && result[0].rows) {
          setRows(result[0].rows); // Update rows state with patient data
        } else {
          console.error("No rows found in result:", result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const db = await getDB(); // Get the database instance

      // Insert patient data into the database
      await db.exec(`INSERT INTO patients (name, disease) VALUES ('${name}', '${disease}')`);
      console.log("Patient data inserted");

      // Refresh the patient data
      const result = await db.exec("SELECT * FROM patients");
      if (result && result[0] && result[0].rows) {
        setRows(result[0].rows); // Update rows state with new patient data
      }

      // Clear the form
      setName('');
      setDisease('');

    } catch (error) {
      console.error("Error inserting patient data:", error);
    }
  };

  return (
    <div>
      <h1>Patient Registration</h1>

      {/* Patient Form */}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Disease:
          <input
            type="text"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Patient</button>
      </form>

      {/* Patient Data */}
      <h2>Patient Data:</h2>
      <ul>
        {Array.isArray(rows) && rows.length > 0 ? (
          rows.map((row, index) => (
            <li key={index}>
              {row.name} - {row.disease}
            </li>
          ))
        ) : (
          <p>No data available</p>
        )}
      </ul>
    </div>
  );
}

export default App
