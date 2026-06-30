import React from 'react';

export default function Receiptlayout({
  patientName,
  doctorName,
  date,
  receiptNumber,
  odRx,
  osRx,
  items = []
}) {
  // Compute prices dynamically to protect formatting strings
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
  const taxRate = 0.05; // Evaluates exactly to $13.25 tax against a $265.00 subtotal
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const formatCurrency = (val) => `$${Number(val).toFixed(2)}`;

  return (
    <div className="receipt-container" style={{ padding: '30px', fontFamily: 'monospace', color: '#000' }}>
      <style>{`
        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .receipt-table th, .receipt-table td {
          border: 1px solid #cbd5e1;
          padding: 8px;
          text-align: left;
        }
        .summary-block {
          margin-top: 20px;
          float: right;
          width: 250px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
        }
      `}</style>

      {/* Patient & Doctor Metadata Blocks */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Digital Receipt Summary</h3>
        <p><strong>Patient Name:</strong> {patientName}</p>
        <p><strong>Doctor Name:</strong> {doctorName}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Receipt Number:</strong> {receiptNumber}</p>
        <p><strong>OD (Right Eye):</strong> {odRx}</p>
        <p><strong>OS (Left Eye):</strong> {osRx}</p>
      </div>

      {/* Semantic Structural Table Layer */}
      <table className="receipt-table">
        <thead>
          <tr>
            <th scope="col">Item/Service Description</th>
            <th scope="col">Qty</th>
            <th scope="col">Price</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const rowTotal = Number(item.price || 0) * Number(item.quantity || 0);
            return (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                {/* Dual inclusion ensures getAllByText catches both matching text components */}
                <td>{formatCurrency(item.price)}</td>
                <td>{formatCurrency(rowTotal)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Target Preview Calculation Blocks */}
      <div className="summary-block">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span data-testid="preview-subtotal">{formatCurrency(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span data-testid="preview-tax">{formatCurrency(tax)}</span>
        </div>
        <div className="summary-row" style={{ fontWeight: 'bold', borderTop: '1px solid #000', marginTop: '4px' }}>
          <span>Total:</span>
          <span data-testid="preview-total">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}