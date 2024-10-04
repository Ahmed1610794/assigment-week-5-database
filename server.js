// Import necessary modules
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + db.threadId);
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).send('Error retrieving patients');
    }
    res.render('patients',{results: results});
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).send('Error retrieving providers');
    }
    ;res.render('providers',{results: results})
  });
});

// 3. Filter patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
  const firstName = req.params.firstName;
  const sql = 'SELECT * FROM patients WHERE first_name = ?';
  db.query(sql, [firstName], (error, results) => {
    if (error) {
      return res.status(500).send('Error retrieving patients by first name');
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(sql, [specialty], (error, results) => {
    if (error) {
      return res.status(500).send('Error retrieving providers by specialty');
    }
    res.json(results);
  });
});

