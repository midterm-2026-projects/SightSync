import { useMemo, useState } from "react";
import { confirmPayment, createPayment } from "../../services/paymentsApi";

const currency = (value) => `₱${Number(value || 0).toFixed(2)}`;

export default function PaymentForm({ prefill = {}, onSuccess }) {
  const [patientName, setPatientName] = useState(prefill.patientName || "");
  const [doctorName, setDoctorName] = useState(prefill.doctorName || "");
  const [amount, setAmount] = useState(
    prefill.items?.length
      ? prefill.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0).toFixed(2)
      : ""
  );
  const [method, setMethod] = useState("cash");
  const [step, setStep] = useState(1);
  const [pendingPaymentId, setPendingPaymentId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => patientName.trim() && doctorName.trim() && amount !== "" && Number(amount) > 0, [patientName, doctorName, amount]);

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payment = await createPayment({
        patient_name: patientName,
        doctor_name: doctorName,
        amount: Number(amount),
        method,
      });
      setPendingPaymentId(payment.id);
      setStep(2);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await confirmPayment(pendingPaymentId);
      const currentAmount = Number(amount);
      const updatedReceipt = {
        ...result.receipt,
        items: [
          {
            name: "Payment Amount",
            quantity: 1,
            price: currentAmount,
          },
        ],
        subtotal: currentAmount,
        tax: Number((currentAmount * 0.12).toFixed(2)),
        total: Number((currentAmount * 1.12).toFixed(2)),
      };

      const enrichedResult = {
        payment: {
          ...result.payment,
          patient_name: patientName,
          doctor_name: doctorName,
          amount: currentAmount,
          method,
        },
        receipt: updatedReceipt,
      };
      setSuccess("Payment confirmed & receipt generated");
      onSuccess?.(enrichedResult);
      setPatientName("");
      setDoctorName("");
      setAmount("");
      setMethod("cash");
      setPendingPaymentId(null);
      setStep(1);
    } catch (err) {
      setError(err.message || "Confirm failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError("");
    setSuccess("");
    setStep(1);
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", display: "grid", gap: "12px" }}>
      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>Payment Record</h3>

      {step === 1 ? (
        <>
          <label>
            <span style={{ display: "block", marginBottom: "4px" }}>Patient Name</span>
            <input aria-label="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
          </label>

          <label>
            <span style={{ display: "block", marginBottom: "4px" }}>Doctor</span>
            <input aria-label="Doctor" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
          </label>

          <label>
            <span style={{ display: "block", marginBottom: "4px" }}>Amount</span>
            <input aria-label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
          </label>

          <label>
            <span style={{ display: "block", marginBottom: "4px" }}>Payment Method</span>
            <select aria-label="Payment Method" value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="insurance">Insurance</option>
              <option value="gcash">GCash</option>
            </select>
          </label>

          <button onClick={handleCreate} disabled={!canSubmit || loading} style={{ padding: "10px 12px", borderRadius: "6px", border: "none", background: "#2563eb", color: "#fff", cursor: canSubmit && !loading ? "pointer" : "not-allowed" }}>
            {loading ? "Creating..." : "Create Payment Record"}
          </button>
        </>
      ) : (
        <>
          <div style={{ color: "#0f766e", fontWeight: 600 }}>Payment ID: {pendingPaymentId}</div>
          <div style={{ color: "#475569" }}>Amount: {currency(amount)}</div>
          <button onClick={handleConfirm} disabled={loading} style={{ padding: "10px 12px", borderRadius: "6px", border: "none", background: "#16a34a", color: "#fff", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Confirming..." : "Confirm & Generate Receipt"}
          </button>
          <button onClick={handleCancel} style={{ padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", color: "#334155" }}>
            Cancel
          </button>
        </>
      )}

      {error ? <div style={{ color: "#dc2626" }}>{error}</div> : null}
      {success ? <div style={{ color: "#15803d" }}>{success}</div> : null}
    </div>
  );
}
