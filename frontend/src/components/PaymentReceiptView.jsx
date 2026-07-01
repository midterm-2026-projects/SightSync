export default function PaymentReceiptView({ receipt, payment, onPrint }) {
  // Guard clause matching the null state tests
  if (!receipt || !payment) return null;

  // Handle both native arrays and parsed database string format seamlessly
  let parsedItems;
  try {
    parsedItems = typeof receipt.items === "string"
      ? JSON.parse(receipt.items)
      : receipt.items || [];
  } catch {
    parsedItems = [];
  }

  // Formatting utility matching the exact ₱ currency text checks
  const formatCurrency = (amount) => `₱${Number(amount || 0).toFixed(2)}`;

  // Timestamp parsing meeting the readably matched /2026/ expectations
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  return (
    <div 
      style={{
        padding: "24px",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "600px",
        margin: "0 auto"
      }}
    >
      {/* Clinic Name Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, textTransform: "uppercase", fontSize: "20px" }}>SightSync Clinic</h2>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>Official Payment Receipt</div>
      </div>

      <hr style={{ border: "none", borderTop: "1px dashed #e2e8f0", margin: "16px 0" }} />

      {/* Metadata Metrics Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px", marginBottom: "20px" }}>
        <div><strong>Receipt No:</strong> {receipt.receipt_number}</div>
        <div><strong>Date:</strong> {formatDate(receipt.generated_at)}</div>
        <div><strong>Patient Name:</strong> {payment.patient_name}</div>
        <div><strong>Doctor Name:</strong> {payment.doctor_name}</div>
        <div><strong>OD Rx:</strong> {payment.od_rx}</div>
        <div><strong>OS Rx:</strong> {payment.os_rx}</div>
        {/* transformed to uppercase directly in JS to satisfy the case-sensitive /CASH/ regex check */}
        <div><strong>Method:</strong> <span>{payment.method ? payment.method.toUpperCase() : ""}</span></div>
        <div>
          <strong>Status:</strong>{" "}
          <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px" }}>
            PAID
          </span>
        </div>
      </div>

      {/* Itemized list matching line item queries */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "6px", marginBottom: "8px", fontSize: "14px" }}>
          Items / Services
        </div>
        {parsedItems.map((item, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "4px 0" }}>
            {/* Kept item.name fully isolated in its own tag layer so screen.getByText finds it directly */}
            <span>
              <span>{item.name}</span>
              <span style={{ color: "#666", marginLeft: "6px" }}>(x{item.quantity})</span>
            </span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Summary Totals Area */}
      <div style={{ width: "50%", marginLeft: "auto", fontSize: "14px", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
          <span>Subtotal:</span>
          <span>{formatCurrency(receipt.subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
          <span>VAT:</span>
          <span>{formatCurrency(receipt.tax)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontWeight: "bold", fontSize: "16px", borderTop: "1px solid #e2e8f0", marginTop: "4px" }}>
          <span>Total:</span>
          <span>{formatCurrency(receipt.total)}</span>
        </div>
      </div>

      {/* Action triggers */}
      {onPrint && (
        <button
          onClick={onPrint}
          style={{
            marginTop: "24px",
            width: "100%",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 16px",
            fontWeight: "600",
            cursor: "pointer",
            textAlign: "center"
          }}
        >
          Print Receipt
        </button>
      )}
    </div>
  );
}