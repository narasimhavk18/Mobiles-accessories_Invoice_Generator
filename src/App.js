import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';
import LoginSignup from './LoginSignup';
import HomePage from './HomePage'; // import Home Page

function App() {
  const [screen, setScreen] = useState('home'); // 'home', 'login', 'app'

  const [invoiceInfo, setInvoiceInfo] = useState({
    sellerName: '',
    buyerName: '',
    contactNumber: '',
    invoiceDate: '',
    invoiceNumber: '',
    paymentMethod: '',
    taxPercent: 1,
  });

  const [items, setItems] = useState([]);

  const handleInfoChange = (e) => {
    const { id, value } = e.target;
    setInvoiceInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === 'quantity' || field === 'price'
        ? parseFloat(value) || 0
        : value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        item: '',
        brand: '',
        model: '',
        imei: '',
        warranty: '',
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getTotal = () =>
    items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const getTotalWithTax = () => {
    const base = getTotal();
    const tax = base * (invoiceInfo.taxPercent / 100);
    return base + tax;
  };

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('Mobile Store Invoice', 70, 15);

    doc.setFontSize(12);
    let y = 25;

    [
      ['Seller Name:', invoiceInfo.sellerName],
      ['Buyer Name:', invoiceInfo.buyerName],
      ['Contact Number:', invoiceInfo.contactNumber],
      ['Invoice Number:', invoiceInfo.invoiceNumber],
      ['Purchased Date:', invoiceInfo.invoiceDate],
      ['Payment Method:', invoiceInfo.paymentMethod],
    ].forEach(([label, value], i) => {
      const lineY = y + i * 7;
      doc.setFont(undefined, 'bold');
      doc.text(label, 14, lineY);
      doc.setFont(undefined, 'normal');
      doc.text(value, 50, lineY);
    });

    const tableHead = [
      ['Item', 'Brand', 'Model', 'IMEI', 'Warranty', 'Qty', 'Price (Rs.)', 'Total (Rs.)'],
    ];

    const tableBody = items.map((item) => [
      item.item,
      item.brand,
      item.model,
      item.imei,
      item.warranty,
      item.quantity.toString(),
      item.price.toFixed(2),
      (item.quantity * item.price).toFixed(2),
    ]);

    autoTable(doc, {
      startY: y + 6 * 7 + 10,
      head: tableHead,
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 35 },
        4: { cellWidth: 20 },
        5: { cellWidth: 10 },
        6: { cellWidth: 25 },
        7: { cellWidth: 25 },
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(`Grand Total (with GST): Rs. ${getTotalWithTax().toFixed(2)}`, 120, finalY);

    doc.save('mobile-store-invoice.pdf');
  };

  if (screen === 'home') {
    return <HomePage onContinue={() => setScreen('login')} />;
  }

  if (screen === 'login') {
    return <LoginSignup onLogin={() => setScreen('app')} />;
  }

  return (
    <div className="invoice-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gadget Invoice Pro</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
  <button
    onClick={() => setScreen('home')}
    style={{
      padding: '6px 12px',
      backgroundColor: '#6c757d',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
    }}
  >
    Back to Home
  </button>
  <button
    onClick={() => setScreen('home')}
    style={{
      padding: '6px 12px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
    }}
  >
    Logout
  </button>
</div>

      </div>

      <div className="info-box">
        <label>Seller Name: <input type="text" id="sellerName" value={invoiceInfo.sellerName} onChange={handleInfoChange} /></label>
        <label>Buyer Name: <input type="text" id="buyerName" value={invoiceInfo.buyerName} onChange={handleInfoChange} /></label>
        <label>Contact Number: <input type="text" id="contactNumber" value={invoiceInfo.contactNumber} onChange={handleInfoChange} /></label>
        <label>Date: <input type="date" id="invoiceDate" value={invoiceInfo.invoiceDate} onChange={handleInfoChange} /></label>
        <label>Invoice Number: <input type="text" id="invoiceNumber" value={invoiceInfo.invoiceNumber} onChange={handleInfoChange} /></label>
        <label>Payment Method:
          <select id="paymentMethod" value={invoiceInfo.paymentMethod} onChange={handleInfoChange}>
            <option value="">-- Select Payment Method --</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="EMI">EMI</option>
          </select>
        </label>
        <label>GST %: <input type="number" id="taxPercent" value={invoiceInfo.taxPercent} onChange={handleInfoChange} /></label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Brand</th>
            <th>Model</th>
            <th>IMEI</th>
            <th>Warranty(m)</th>
            <th>Qty</th>
            <th>Price (₹)</th>
            <th>Total (₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => (
            <tr key={index}>
              <td><input value={row.item} onChange={(e) => handleItemChange(index, 'item', e.target.value)} /></td>
              <td><input value={row.brand} onChange={(e) => handleItemChange(index, 'brand', e.target.value)} /></td>
              <td><input value={row.model} onChange={(e) => handleItemChange(index, 'model', e.target.value)} /></td>
              <td><input value={row.imei} onChange={(e) => handleItemChange(index, 'imei', e.target.value)} /></td>
              <td><input value={row.warranty} onChange={(e) => handleItemChange(index, 'warranty', e.target.value)} /></td>
              <td><input type="number" value={row.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} /></td>
              <td><input type="number" value={row.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} /></td>
              <td>₹{(row.quantity * row.price).toFixed(2)}</td>
              <td><button onClick={() => removeItem(index)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem}>Add Item</button>
      <p className="total">Grand Total (with GST): ₹{getTotalWithTax().toFixed(2)}</p>
      <div className="actions">
        <button onClick={generatePDF}>Download Invoice PDF</button>
      </div>
    </div>
  );
}

export default App;
