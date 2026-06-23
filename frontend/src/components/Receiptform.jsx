
export default function ReceiptForm({
  patientName, setPatientName,
  doctorName, setDoctorName,
  date, setDate,
  receiptNumber, setReceiptNumber,
  odRx, setOdRx,
  osRx, setOsRx,
  items, handleItemChange,
  handlePrint
}) {
  return (
    <div className="input-panel no-print">
      {/* SCOPED FORM STYLES */}
      <style>{`
        .input-panel {
          background-color: #ffffff;
          padding: 40px;
          border-right: 1px solid #e2e8f0;
          overflow-y: auto;
          max-height: 100vh;
        }

        .panel-title {
          margin: 0 0 25px 0;
          font-size: 22px;
          color: #111827;
          border-bottom: 2px solid #111827;
          padding-bottom: 10px;
        }

        .section-divider-title {
          margin: 25px 0 15px 0;
          font-size: 16px;
          color: #0f766e;
          text-transform: uppercase;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }

        .input-group label {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 6px;
          color: #4b5563;
        }

        .input-group input {
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
        }

        .input-group input:focus {
          outline: none;
          border-color: #0f766e;
          background-color: #f0fdfa;
        }

        .input-row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .item-input-row {
          display: flex;
          gap: 10px;
          align-items: center;
          background: #f8fafc;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 10px;
          border: 1px solid #e2e8f0;
        }

        .flex-grow-2 { flex: 2; }
        .width-small { width: 90px; }
        .width-mini { width: 60px; }

        .action-button-container {
          width: 100%;
          margin-top: 25px;
        }

        .print-action-btn {
          width: 100%;
          padding: 14px;
          background-color: #0f766e;
          color: white;
          font-family: inherit;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(15, 118, 110, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .print-action-btn:hover {
          background-color: #0d5c56;
        }
      `}</style>

      <h2 className="panel-title">Receipt Data Input</h2>
      
      <div className="input-group">
        <label htmlFor="patientNameInput">Patient Name</label>
        <input 
          id="patientNameInput" 
          type="text" 
          value={patientName} 
          onChange={(e) => setPatientName(e.target.value)} 
        />
      </div>

      <div className="input-group">
        <label htmlFor="doctorNameInput">Doctor Name</label>
        <input 
          id="doctorNameInput" 
          type="text" 
          value={doctorName} 
          onChange={(e) => setDoctorName(e.target.value)} 
        />
      </div>

      <div className="input-row-grid">
        <div className="input-group">
          <label htmlFor="dateInput">Date</label>
          <input 
            id="dateInput" 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <label htmlFor="receiptNumberInput">Receipt Number</label>
          <input 
            id="receiptNumberInput" 
            type="text" 
            value={receiptNumber} 
            onChange={(e) => setReceiptNumber(e.target.value)} 
          />
        </div>
      </div>

      <h3 className="section-divider-title">Prescription Record (Rx)</h3>
      <div className="input-group">
        <label htmlFor="odRxInput">OD (Right Eye)</label>
        <input 
          id="odRxInput" 
          type="text" 
          value={odRx} 
          onChange={(e) => setOdRx(e.target.value)} 
        />
      </div>
      <div className="input-group">
        <label htmlFor="osRxInput">OS (Left Eye)</label>
        <input 
          id="osRxInput" 
          type="text" 
          value={osRx} 
          onChange={(e) => setOsRx(e.target.value)} 
        />
      </div>

      <h3 className="section-divider-title">Line Items</h3>
      {items.map((item, index) => (
        <div key={index} className="item-input-row">
          <div className="input-group flex-grow-2">
            <label htmlFor={`itemDescInput-${index}`}>Description</label>
            <input 
              id={`itemDescInput-${index}`} 
              type="text" 
              value={item.name} 
              onChange={(e) => handleItemChange(index, 'name', e.target.value)} 
            />
          </div>
          <div className="input-group width-mini">
            <label htmlFor={`itemQtyInput-${index}`}>Qty</label>
            <input 
              id={`itemQtyInput-${index}`} 
              type="number" 
              min="1" 
              value={item.quantity} 
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
            />
          </div>
          <div className="input-group width-small">
            <label htmlFor={`itemPriceInput-${index}`}>Price ($)</label>
            <input 
              id={`itemPriceInput-${index}`} 
              type="number" 
              step="0.01" 
              value={item.price} 
              onChange={(e) => handleItemChange(index, 'price', e.target.value)} 
            />
          </div>
        </div>
      ))}

      <div className="action-button-container">
        <button className="print-action-btn" onClick={handlePrint}>
          🖨️ Print Digital Receipt
        </button>
      </div>
    </div>
  );
}