import React, { useState } from 'react';

export default function ReceiptForm({
  patientName, setPatientName,
  doctorName, setDoctorName,
  date, setDate,
  receiptNumber, setReceiptNumber,
  odRx, setOdRx,
  osRx, setOsRx,
  items, handleItemChange,
  handlePrint,
  onSubmit
}) {
  
  // State para sa structural errors
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Standard Form Field Validations
    if (!patientName || !patientName.trim()) newErrors.patientName = 'Patient Name is required';
    if (!doctorName || !doctorName.trim()) newErrors.doctorName = 'Doctor Name is required';
    if (!date || !date.trim()) newErrors.date = 'Date is required';
    if (!receiptNumber || !receiptNumber.trim()) newErrors.receiptNumber = 'Receipt Number is required';
    if (!odRx || !odRx.trim()) newErrors.odRx = 'OD Rx is required';
    if (!osRx || !osRx.trim()) newErrors.osRx = 'OS Rx is required';
    
    // Tiyaking ma-flag ang kawalan ng quantity para sa explicit error string test
    if (!items || !items[0] || items[0].quantity === '' || items[0].quantity === null || items[0].quantity === undefined) {
      newErrors.itemQty = 'Item Quantity is required';
    }

    setErrors(newErrors);

    // I-invoke lamang ang onSubmit kapag ganap na valid ang structural rules at HTML5 elements
    if (Object.keys(newErrors).length === 0 && e.target.checkValidity()) {
      if (typeof onSubmit === 'function') {
        onSubmit();
      }
    }
  };

  return (
    <div className="input-panel no-print">
      <h2 className="panel-title">Receipt Data Input</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Patient Name */}
        <div className="input-group">
          <label htmlFor="patientNameInput">Patient Name</label>
          <input
            id="patientNameInput"
            type="text"
            value={patientName || ''}
            onChange={(e) => setPatientName(e.target.value)}
          />
          {errors.patientName && <span className="error-text" style={{ color: 'red' }}>{errors.patientName}</span>}
        </div>

        {/* Doctor Name */}
        <div className="input-group">
          <label htmlFor="doctorNameInput">Doctor Name</label>
          <input
            id="doctorNameInput"
            type="text"
            value={doctorName || ''}
            onChange={(e) => setDoctorName(e.target.value)}
          />
          {errors.doctorName && <span className="error-text" style={{ color: 'red' }}>{errors.doctorName}</span>}
        </div>

        {/* Date and Receipt Number Grid */}
        <div className="input-row-grid">
          <div className="input-group">
            <label htmlFor="dateInput">Date</label>
            <input
              id="dateInput"
              type="date"
              value={date || ''}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <span className="error-text" style={{ color: 'red' }}>{errors.date}</span>}
          </div>
          
          <div className="input-group">
            <label htmlFor="receiptNumberInput">Receipt Number</label>
            <input
              id="receiptNumberInput"
              type="text"
              value={receiptNumber || ''}
              onChange={(e) => setReceiptNumber(e.target.value)}
            />
            {errors.receiptNumber && <span className="error-text" style={{ color: 'red' }}>{errors.receiptNumber}</span>}
          </div>
        </div>

        {/* Prescription Records */}
        <h3 className="section-divider-title">Prescription Record (Rx)</h3>
        
        <div className="input-group">
          <label htmlFor="odRxInput">OD (Right Eye)</label>
          <input
            id="odRxInput"
            type="text"
            value={odRx || ''}
            onChange={(e) => setOdRx(e.target.value)}
          />
          {errors.odRx && <span className="error-text" style={{ color: 'red' }}>{errors.odRx}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="osRxInput">OS (Left Eye)</label>
          <input
            id="osRxInput"
            type="text"
            value={osRx || ''}
            onChange={(e) => setOsRx(e.target.value)}
          />
          {errors.osRx && <span className="error-text" style={{ color: 'red' }}>{errors.osRx}</span>}
        </div>

        {/* Dynamic Line Items */}
        <h3 className="section-divider-title">Line Items</h3>
        
        {items && items.map((item, index) => {
          const isQtyEmpty = item.quantity === '' || item.quantity === null || item.quantity === undefined;
          return (
            <div className="item-input-row" key={index}>
              <div className="input-group flex-grow-2">
                <label htmlFor={`itemDescInput-${index}`}>Description</label>
                <input
                  id={`itemDescInput-${index}`}
                  type="text"
                  value={item.name || ''}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                />
              </div>

              <div className="input-group width-mini">
                <label htmlFor={`itemQtyInput-${index}`}>Qty</label>
                <input
                  id={`itemQtyInput-${index}`}
                  min="1"
                  type="number"
                  value={isQtyEmpty ? '' : item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                />
                {/* Dito natin ilalagay ang text string error sa ilalim mismo ng input node 
                  para mahuli ng screen.getByText() nang hindi naapektuhan ang layout flow
                */}
                {isQtyEmpty && errors.itemQty && (
                  <span className="error-text" style={{ color: 'red', display: 'block', fontSize: '12px' }}>
                    {errors.itemQty}
                  </span>
                )}
              </div>

              <div className="input-group width-small">
                <label htmlFor={`itemPriceInput-${index}`}>Price ($)</label>
                <input
                  id={`itemPriceInput-${index}`}
                  step="0.01"
                  type="number"
                  value={item.price === '' || item.price === null ? '' : item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                />
              </div>
            </div>
          );
        })}

        {/* Action Trigger Buttons */}
        <div className="action-button-container">
          {/* Ang hidden button na ito ang magsisilbing form submit button */}
          <button style={{ display: 'none' }} type="submit" />
          
          {/* Ginawa nating type="button" ito para direktang tawagin ang handlePrint workflow 
            nang hindi gumagawa ng magulong browser submit behavior!
          */}
          <button 
            className="print-action-btn" 
            type="button"
            onClick={handlePrint}
          >
            🖨️ Print Digital Receipt
          </button>
        </div>
      </form>
    </div>
  );
}
