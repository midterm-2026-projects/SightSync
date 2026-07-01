import { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";
import PaymentReceiptView from "./PaymentReceiptView";
import { fetchPayments } from "../services/paymentsApi";

export default function PaymentsPanel({ prefill, __testOnSuccessRef }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const handleStartNewPayment = () => {
    setActiveReceipt(null);
    setFormKey((prev) => prev + 1);
  };

  useEffect(() => {
    fetchPayments()
      .then((data) => setHistory(data))
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    if (__testOnSuccessRef) {
      __testOnSuccessRef((result) => {
        setActiveReceipt(result);
        setHistory((prev) => [
          {
            ...result.payment,
            receipt_id: result.receipt.id,
            receipt_number: result.receipt.receipt_number,
            receipt_total: result.receipt.total,
          },
          ...prev,
        ]);
      });
    }
  }, [__testOnSuccessRef]);

  const handleSuccess = (result) => {
    setActiveReceipt(result);
    setHistory((prev) => [
      {
        ...result.payment,
        receipt_id: result.receipt.id,
        receipt_number: result.receipt.receipt_number,
        receipt_total: result.receipt.total,
      },
      ...prev,
    ]);
  };

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>Payments</h2>
        <button
          type="button"
          onClick={handleStartNewPayment}
          style={{
            padding: "10px 16px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add New Payment
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: activeReceipt ? "1fr 1fr" : "1fr", gap: "24px", alignItems: "start" }}>
        <PaymentForm key={formKey} prefill={prefill} onSuccess={handleSuccess} />
        {activeReceipt && (
          <div>
            <PaymentReceiptView payment={activeReceipt.payment} receipt={activeReceipt.receipt} onPrint={() => window.print()} />
          </div>
        )}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>Payment History</h3>
        {loadingHistory ? (
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading…</p>
        ) : history.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>No payments yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Receipt #</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Patient</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Doctor</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Amount</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Method</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px" }}>{p.receipt_number || "—"}</td>
                    <td style={{ padding: "10px" }}>{p.patient_name}</td>
                    <td style={{ padding: "10px" }}>{p.doctor_name}</td>
                    <td style={{ padding: "10px" }}>₱{Number(p.receipt_total ?? p.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "10px", textTransform: "capitalize" }}>{p.method}</td>
                    <td style={{ padding: "10px" }}>{p.status}</td>
                    <td style={{ padding: "10px" }}>{new Date(p.created_at).toLocaleDateString("en-PH")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
