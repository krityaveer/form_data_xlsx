// ExcelExportComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ExcelExportComponent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/export-excel', formData, {
        responseType: 'blob', // Important: responseType as blob
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element, set the download attribute and append to DOM
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'form_data.xlsx');
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Cleanup: remove the link element from DOM
      link.remove();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <div>
      <h2>Export Form Data to Excel</h2>
      <form>
        <label>First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />

        <label>Last Name:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />

        <label>Phone:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />

        <button type="button" onClick={handleExportToExcel}>Export to Excel</button>
      </form>
    </div>
  );
};

export default ExcelExportComponent;
 