// server.js
const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API endpoint to export data to Excel
app.post('/api/export-excel', (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  // Format data into desired structure
  const data = [
    { 'First Name': firstName, 'Last Name': lastName, 'Email': email, 'Phone': phone }
  ];

  // Create workbook
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Write Excel file to a temporary location
  const tempFilePath = path.join(__dirname, 'temp', 'form_data.xlsx');
  xlsx.writeFile(wb, tempFilePath);

  // Read the generated file and send it as a response
  const fileData = fs.readFileSync(tempFilePath);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=form_data.xlsx');
  res.send(fileData);

  // Cleanup: Delete the temporary file
  fs.unlinkSync(tempFilePath);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
