

// export const formatCurrency = (amount) => {
//   return `$${amount.toFixed(2)}`;
// };
import { formatCurrency } from "./receiptContants";

export default function ReceiptDetails({
  patientName,
  doctorName,
  date,
  receiptNumber,
  odRx,
  osRx,
  items
}) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const salesTax = subtotal * 0.05; 
  const totalAmountPaid = subtotal + salesTax;

  return (
    <div className="receipt-preview-panel">
      {/* SCOPED PREVIEW & PRINT STYLES */}
      <style>{`
        .receipt-preview-panel {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px;
          overflow-y: auto;
          max-height: 100vh;
        }

        .receipt-container {
          background: #ffffff;
          width: 100%;
          max-width: 480px; 
          padding: 30px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          box-sizing: border-box;
        }

        .receipt-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px dashed #cbd5e1;
          padding-bottom: 15px;
        }

        .store-name {
          font-size: 22px;
          font-weight: bold;
          margin: 0 0 4px 0;
          letter-spacing: 0.5px;
          color: #111827;
        }

        .store-meta {
          font-size: 13px;
          color: #4b5563;
          margin: 2px 0;
        }

        .receipt-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .receipt-id {
          font-weight: bold;
          color: #111827;
        }

        .prescription-summary {
          background-color: #f1f5f9;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 13px;
          border-left: 4px solid #0f766e;
        }

        .rx-title {
          font-weight: bold;
          margin-bottom: 8px;
          color: #0f766e;
        }

        .rx-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .receipt-items {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .table-header-row {
          border-bottom: 1px solid #111827;
        }

        .table-cell {
          padding: 10px 0;
          font-size: 13px;
          vertical-align: top;
        }

        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        .receipt-totals {
          border-top: 2px dashed #cbd5e1;
          padding-top: 15px;
          margin-bottom: 25px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .grand-total {
          font-weight: bold;
          font-size: 18px;
          color: #111827;
          border-top: 1px solid #111827;
          padding-top: 8px;
          margin-top: 6px;
        }

        .receipt-footer {
          text-align: center;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
      `}</style>

      <div className="receipt-container">
        <header className="receipt-header">
          <h1 className="store-name">SIGHTSYNC EYE CLINIC</h1>
          <p className="store-meta">Optometry & Advanced Vision Care</p>
          <p className="store-meta">123 Innovation Way, Tech City</p>
          <p className="store-meta">Tel: +1 (555) 019-2834</p>
        </header>

        <div className="receipt-meta">
          <div>
            <strong>Patient:</strong> <span data-testid="preview-patient">{patientName}</span><br />
            <strong>Doctor:</strong> <span data-testid="preview-doctor">{doctorName}</span><br />
            <strong>Date:</strong> <span>{date}</span>
          </div>
          <div className="text-right">
            <strong>Receipt #:</strong><br />
            <span className="receipt-id">{receiptNumber}</span>
          </div>
        </div>

        <div className="prescription-summary">
          <div className="rx-title">PRESCRIPTION RECORD (Rx)</div>
          <div className="rx-row"><span>OD (Right Eye):</span> <span>{odRx}</span></div>
          <div className="rx-row"><span>OS (Left Eye):</span> <span>{osRx}</span></div>
        </div>

        <table className="receipt-items">
          <thead>
            <tr className="table-header-row">
              <th className="text-left">Item/Service Description</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="table-cell">{item.name}</td>
                <td className="table-cell text-center">{item.quantity}</td>
                <td className="table-cell text-right">{formatCurrency(item.price)}</td>
                <td className="table-cell text-right">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span data-testid="preview-subtotal">{formatCurrency(subtotal)}</span>
          </div>
          <div className="total-row">
            <span>Sales Tax (5%)</span>
            <span data-testid="preview-tax">{formatCurrency(salesTax)}</span>
          </div>
          <div className="total-row grand-total">
            <span>Total Amount Paid</span>
            <span data-testid="preview-total">{formatCurrency(totalAmountPaid)}</span>
          </div>
        </div>

        <footer className="receipt-footer">
          <p>Thank you for trusting us with your vision!</p>
          <p>Frame warranties apply for 12 months from purchase date.</p>
        </footer>
      </div>
    </div>
  );
}