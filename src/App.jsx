import { useState, useEffect } from 'react';
import './App.css';
import { getDB } from './db';

function App() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientData, setPatientData] = useState({
    name: '',
    dob: '',
    gender: '',
    contact: '',
    address: '',
    disease: '',
  });
  const [editId, setEditId] = useState(null);
  
  // Load patients data from the database with search functionality
  const loadPatients = async (search = '') => {
    try {
      const db = await getDB();
      let query = 'SELECT * FROM patients';
      
      if (search) {
        query += ` WHERE name LIKE '%${search}%' OR disease LIKE '%${search}%'`;
      }

      const result = await db.exec(query);
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
      // UPDATE query
      await db.exec(`
        UPDATE patients SET
          name = '${patientData.name}',
          dob = '${patientData.dob}',
          gender = '${patientData.gender}',
          contact = '${patientData.contact}',
          address = '${patientData.address}',
          disease = '${patientData.disease}'
        WHERE id = ${editId}
      `);
      setEditId(null);
    } else {
      // INSERT query
      await db.exec(`
        INSERT INTO patients (name, dob, gender, contact, address, disease)
        VALUES (
          '${patientData.name}',
          '${patientData.dob}',
          '${patientData.gender}',
          '${patientData.contact}',
          '${patientData.address}',
          '${patientData.disease}'
        )
      `);
    }

    setPatientData({ name: '', dob: '', gender: '', contact: '', address: '', disease: '' });
    loadPatients(searchQuery);
  };

  // Handle Delete Function
  const handleDelete = async (id) => {
    const db = await getDB();
    await db.exec(`DELETE FROM patients WHERE id = ${id}`);
    loadPatients(searchQuery); // Refresh list
  };

  // Handle Edit Function
  const handleEdit = (patient) => {
    setPatientData({
      name: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      contact: patient.contact,
      address: patient.address,
      disease: patient.disease,
    });
    setEditId(patient.id);
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Load patients initially and when searchQuery changes
  useEffect(() => {
    loadPatients(searchQuery);
  }, [searchQuery]);

  return (
    <div>
      <h1>Patient Registration</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name or disease"
      />

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
        <button type="submit">Add Patient</button>
      </form>

      <h2>Patient List</h2>
      <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Disease</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
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
    </div>
  );
}

export default App;