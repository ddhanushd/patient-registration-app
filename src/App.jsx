import React, { useState, useEffect } from 'react';
import './App.css';
import { getDB } from './db';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientData, setPatientData] = useState({
    name: '',
    dob: null, // Keep as null for no initial date selected
    gender: '',
    contact: '',
    address: '',
    disease: '',
  });
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Adjust timeout as needed
  };

  const loadPatients = async (search = '', sortBy = null, sortDir = 'asc') => {
    try {
      const db = await getDB();
      let query = 'SELECT * FROM patients';

      if (search) {
        query += ` WHERE name LIKE '%${search}%' OR disease LIKE '%${search}%'`;
      }

      if (sortBy) {
        query += ` ORDER BY ${sortBy} ${sortDir}`;
      } else {
        query += ' ORDER BY id DESC'; // Default sorting
      }

      const result = await db.exec(query);
      setPatients(result[0].rows);
    } catch (error) {
      console.error('Error fetching patients data:', error);
      showNotification('Error loading patients', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setPatientData((prevState) => ({
      ...prevState,
      dob: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = await getDB();
    const { name, dob, gender, contact, address, disease } = patientData;
    const formattedDob = dob ? dob.toISOString().split('T')[0] : ''; // Format date for database

    if (!name) {
      showNotification('Name is required', 'error');
      return;
    }

    try {
      if (editId) {
        await db.exec(`
          UPDATE patients SET
            name = '${name}',
            dob = '${formattedDob}',
            gender = '${gender}',
            contact = '${contact}',
            address = '${address}',
            disease = '${disease}'
          WHERE id = ${editId}
        `);
        showNotification('Patient updated successfully');
        setEditId(null);
      } else {
        await db.exec(`
          INSERT INTO patients (name, dob, gender, contact, address, disease)
          VALUES (
            '${name}',
            '${formattedDob}',
            '${gender}',
            '${contact}',
            '${address}',
            '${disease}'
          )
        `);
        showNotification('Patient added successfully');
      }

      setPatientData({ name: '', dob: null, gender: '', contact: '', address: '', disease: '' });
      loadPatients(searchQuery, sortColumn, sortDirection);
    } catch (error) {
      console.error('Error submitting patient data:', error);
      showNotification('Error saving patient data', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      const db = await getDB();
      try {
        await db.exec(`DELETE FROM patients WHERE id = ${id}`);
        showNotification('Patient deleted successfully');
        loadPatients(searchQuery, sortColumn, sortDirection);
      } catch (error) {
        console.error('Error deleting patient:', error);
        showNotification('Error deleting patient', 'error');
      }
    }
  };

  const handleEdit = (patient) => {
    setPatientData({
      name: patient.name,
      dob: patient.dob ? new Date(patient.dob) : null,
      gender: patient.gender,
      contact: patient.contact,
      address: patient.address,
      disease: patient.disease,
    });
    setEditId(patient.id);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    loadPatients(searchQuery, sortColumn, sortDirection);
  }, [searchQuery, sortColumn, sortDirection]);

  return (
    <div className="container">
      <h1>Patient Management</h1>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="content-wrapper">
        <div className="form-section">
          <h2>{editId ? 'Edit Patient' : 'Patient Registration'}</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={patientData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
              className="form-input"
            />

            <label htmlFor="dob">Date of Birth:</label>
            <DatePicker
              id="dob"
              selected={patientData.dob}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="YYYY-MM-DD" // Display format as placeholder
              showMonthDropdown // Enable month dropdown
              showYearDropdown // Enable year dropdown
              dropdownMode="select" // Use select boxes for month/year
              className="form-input"
            />

            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={patientData.gender}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={patientData.contact}
              onChange={handleInputChange}
              placeholder="Contact"
              className="form-input"
            />

            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={patientData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="form-input"
            />

            <label htmlFor="disease">Disease:</label>
            <input
              type="text"
              id="disease"
              name="disease"
              value={patientData.disease}
              onChange={handleInputChange}
              placeholder="Disease"
              className="form-input"
            />
            <button type="submit">{editId ? 'Update Patient' : 'Add Patient'}</button>
          </form>
        </div>

        <div className="list-section">
          <h2>Patient List</h2>
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or disease"
            />
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name</th>
                  <th onClick={() => handleSort('dob')}>DOB</th>
                  <th onClick={() => handleSort('gender')}>Gender</th>
                  <th onClick={() => handleSort('contact')}>Contact</th>
                  <th onClick={() => handleSort('address')}>Address</th>
                  <th onClick={() => handleSort('disease')}>Disease</th>
                  <th>Actions</th>
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
                    <td className="actions">
                      <button className="edit-btn" onClick={() => handleEdit(patient)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(patient.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;