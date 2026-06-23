import React, { useState } from "react";
// FIX: Import the two actual component files that exist in your folder
import ReceiptForm from "./components/ReceiptForm";
import ReceiptLayout from "./components/ReceiptLayout";

function App() {
  // Your state hooks matching your tests should be here
  const [patientName, setPatientName] = useState("John Doe");
  const [doctorName, setDoctorName] = useState("Dr. Sarah Jenkins, OD");
  const [date, setDate] = useState("2026-06-23");
  const [receiptNumber, setReceiptNumber] = useState("EYE-20260623-NU13");
  const [odRx, setOdRx] = useState("Sph -2.50 / Cyl -0.50 x 180");
  const [osRx, setOsRx] = useState("Sph -2.25 / DS");
  const [items, setItems] = useState([
    { name: 'Anti-Reflective Lenses (1.61)', quantity: 1, price: 120.00 },
    { name: 'Designer Frame - Matte Black', quantity: 1, price: 145.00 }
  ]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'name' ? value : Number(value);
    setItems(updatedItems);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Left side: The data input form panel */}
      <ReceiptForm 
        patientName={patientName} setPatientName={setPatientName}
        doctorName={doctorName} setDoctorName={setDoctorName}
        date={date} setDate={setDate}
        receiptNumber={receiptNumber} setReceiptNumber={setReceiptNumber}
        odRx={odRx} setOdRx={setOdRx}
        osRx={osRx} setOsRx={setOsRx}
        items={items} handleItemChange={handleItemChange}
        handlePrint={handlePrint}
      />

      {/* Right side: The printable receipt preview sheet */}
      <ReceiptLayout 
        patientName={patientName}
        doctorName={doctorName}
        date={date}
        receiptNumber={receiptNumber}
        odRx={odRx}
        osRx={osRx}
        items={items}
      />
    </div>
  );
}

export default App;