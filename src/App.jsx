import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getDB } from './db'

import { PGlite } from '@electric-sql/pglite'
import PGWorker from './worker.js?worker' // Import worker

function App() {
  const [patients, setPatients] = useState([]);
  const [editId, setEditId] = useState(null);

  const [patientData, setPatientData] = useState({
    name: '',
    dob: '',
    gender: '',
    contact: '',
    address: '',
    disease: '',
  });

  // Load patients data from the database
  const loadPatients = async () => {
    try {
      const db = await getDB();
      const result = await db.exec('SELECT * FROM patients');
      setPatients(result[0].rows); // Set the rows of patients
    } catch (error) {
      console.error('Error fetching patients data:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = await getDB();
  
    if (editId) {
      // UPDATE query with escaped values to prevent syntax errors
      const escape = (str) => str.replace(/'/g, "''"); // Escape single quotes
      
      await db.exec(`
        UPDATE patients SET
          name = '${escape(patientData.name)}',
          dob = '${escape(patientData.dob)}',
          gender = '${escape(patientData.gender)}',
          contact = '${escape(patientData.contact)}',
          address = '${escape(patientData.address)}',
          disease = '${escape(patientData.disease)}'
        WHERE id = ${editId}
      `);
      setEditId(null); // Reset edit ID
    } else {
      // INSERT query with escaped values
      const escape = (str) => str.replace(/'/g, "''");
      
      await db.exec(`
        INSERT INTO patients (name, dob, gender, contact, address, disease)
        VALUES (
          '${escape(patientData.name)}',
          '${escape(patientData.dob)}',
          '${escape(patientData.gender)}',
          '${escape(patientData.contact)}',
          '${escape(patientData.address)}',
          '${escape(patientData.disease)}'
        )
      `);
    }
  
    setPatientData({ name: '', dob: '', gender: '', contact: '', address: '', disease: '' });
    loadPatients();
  };

  // Handle Delete Function
  const handleDelete = async (id) => {
    const db = await getDB();
    await db.exec(`DELETE FROM patients WHERE id = ${id}`);
    loadPatients(); // refresh list
  };
  
  // Handle Edit: Step-by-step
  const handleEdit = (patient) => {
    setPatientData({
      name: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      contact: patient.contact,
      address: patient.address,
      disease: patient.disease,
    });
    setEditId(patient.id); // Store the patient's ID to update
  };
  
  // Clear edit mode and reset form
  const handleCancelEdit = () => {
    setEditId(null);
    setPatientData({ name: '', dob: '', gender: '', contact: '', address: '', disease: '' });
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div>
      <h1>Patient Registration</h1>

      {/* Patient Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={patientData.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          type="date"
          name="dob"
          value={patientData.dob}
          onChange={handleInputChange}
          placeholder="Date of Birth"
        />
        <input
          type="text"
          name="gender"
          value={patientData.gender}
          onChange={handleInputChange}
          placeholder="Gender"
        />
        <input
          type="text"
          name="contact"
          value={patientData.contact}
          onChange={handleInputChange}
          placeholder="Contact"
        />
        <input
          type="text"
          name="address"
          value={patientData.address}
          onChange={handleInputChange}
          placeholder="Address"
        />
        <input
          type="text"
          name="disease"
          value={patientData.disease}
          onChange={handleInputChange}
          placeholder="Disease"
        />
        <button type="submit">
          {editId ? 'Update Patient' : 'Add Patient'}
        </button>
      </form>

      {/* Cancel Edit Button */}
      {editId && (
        <button type="button" onClick={handleCancelEdit}>
          Cancel Edit
        </button>
      )}

      <h2>Patient List</h2>
      <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Disease</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.dob}</td>
              <td>{patient.gender}</td>
              <td>{patient.contact}</td>
              <td>{patient.address}</td>
              <td>{patient.disease}</td>
              <td>
                <button onClick={() => handleEdit(patient)}>Edit</button>
                <button onClick={() => handleDelete(patient.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Patient List */}
      <ul>
        {patients.length > 0 ? (
          patients.map((patient) => (
            <li key={patient.id}>
              <strong>{patient.name}</strong> - {patient.disease} - {patient.contact}
            </li>
          ))
        ) : (
          <p>No patients registered.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
