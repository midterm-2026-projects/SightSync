import { useEffect, useMemo, useState } from "react";
import { confirmPayment, createPayment, fetchDoctorsList, fetchPatientsList } from "../../services/paymentsApi";

const currency = (value) => `₱${Number(value || 0).toFixed(2)}`;

function getPatientFullName(p) {
  if (p.first_name || p.last_name) {
    return `${p.first_name || ""} ${p.last_name || ""}`.trim();
  }
  return p.name || `Patient #${p.id}`;
}

function getDoctorFullName(d) {
  if (d.first_name || d.last_name || d.firstName || d.lastName) {
    const first = d.first_name || d.firstName || "";
    const last = d.last_name || d.lastName || "";
    return `Dr. ${first} ${last}`.trim();
  }
  return d.name || `Doctor #${d.id}`;
}

export default function PaymentForm({ prefill = {}, onSuccess }) {
  const [patientName, setPatientName] = useState(prefill.patientName || "");
  const [doctorName, setDoctorName] = useState(prefill.doctorName || "");
  const [selectedCustomerId, setSelectedCustomerId] = useState(prefill.customerId || 1);
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

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getPatients = typeof fetchPatientsList === 'function' ? fetchPatientsList() : Promise.resolve([]);
    const getDoctors = typeof fetchDoctorsList === 'function' ? fetchDoctorsList() : Promise.resolve([]);

    Promise.all([getPatients, getDoctors])
      .then(([patientData, doctorData]) => {
        if (!isMounted) return;
        setPatients(Array.isArray(patientData) ? patientData : []);
        setDoctors(Array.isArray(doctorData) ? doctorData : []);
      })
      .catch((err) => console.error("Error fetching patients/doctors:", err))
      .finally(() => {
        if (isMounted) setLoadingOptions(false);
      });
    return () => { isMounted = false; };
  }, []);

  const canSubmit = useMemo(
    () => patientName.trim() && doctorName.trim() && amount !== "" && Number(amount) > 0,
    [patientName, doctorName, amount]
  );

  const handlePatientChange = (e) => {
    const val = e.target.value;
    setPatientName(val);
    const matched = patients.find((p) => getPatientFullName(p) === val);
    if (matched?.id) setSelectedCustomerId(matched.id);
  };

  const handleCreate = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payment = await createPayment({
        customer_id: selectedCustomerId,
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
        items: [{ name: "Payment Amount", quantity: 1, price: currentAmount }],
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

  const handleCancel = () => { setError(""); setSuccess(""); setStep(1); };

  const selectStyle = { width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", background: "#fff", cursor: "pointer" };
  const labelStyle = { display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "13px", color: "#374151" };

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", display: "grid", gap: "12px" }}>
      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>Payment Record</h3>

      {step === 1 ? (
        <>
          {/* Patient Name — dropdown from backend with free-text fallback */}
          <label>
            <span style={labelStyle}>
              Patient Name
              {loadingOptions && <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: 6, fontWeight: 400 }}>fetching…</span>}
            </span>
            {patients.length > 0 ? (
              <select
                aria-label="Patient Name"
                value={patientName}
                onChange={handlePatientChange}
                style={selectStyle}
              >
                <option value="">— Select Patient —</option>
                {patients.map((p) => {
                  const name = getPatientFullName(p);
                  return <option key={p.id} value={name}>{name}</option>;
                })}
              </select>
            ) : (
              <input
                aria-label="Patient Name"
                value={patientName}
                onChange={handlePatientChange}
                placeholder="Enter patient name"
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
              />
            )}
          </label>

          {/* Doctor — dropdown from backend with free-text fallback */}
          <label>
            <span style={labelStyle}>
              Doctor
              {loadingOptions && <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: 6, fontWeight: 400 }}>fetching…</span>}
            </span>
            {doctors.length > 0 ? (
              <select
                aria-label="Doctor"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                style={selectStyle}
              >
                <option value="">— Select Doctor —</option>
                {doctors.map((d) => {
                  const name = getDoctorFullName(d);
                  return <option key={d.id} value={name}>{name}</option>;
                })}
              </select>
            ) : (
              <input
                aria-label="Doctor"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Enter doctor name"
                style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
              />
            )}
          </label>

          <label>
            <span style={labelStyle}>Amount</span>
            <input
              aria-label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
            />
          </label>

          <label>
            <span style={labelStyle}>Payment Method</span>
            <select
              aria-label="Payment Method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={selectStyle}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="insurance">Insurance</option>
              <option value="gcash">GCash</option>
            </select>
          </label>

          <button
            onClick={handleCreate}
            disabled={!canSubmit || loading}
            style={{ padding: "10px 12px", borderRadius: "6px", border: "none", background: "#2563eb", color: "#fff", cursor: canSubmit && !loading ? "pointer" : "not-allowed" }}
          >
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
