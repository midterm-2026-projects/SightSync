import { useState } from "react";
import ReceiptPreview from "./ReceiptPreview";

function PaymentValidation() {

  const [form, setForm] = useState({
    customerId: "",
    amount: "",
    date: "",
    type: "Payment",
  });

  const [receipt, setReceipt] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const previewReceipt = (e) => {
    e.preventDefault();

    if (form.customerId === "") {
      alert("Customer ID is required");
      return;
    }

    if (Number(form.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    if (form.date === "") {
      alert("Date is required");
      return;
    }

    setReceipt({
      receiptNo: "RCPT-" + Date.now(),
      ...form,
    });
  };

  return (
    <div style={{
      width: "400px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px"
    }}>

      <h2>Payment Validation</h2>

      <form onSubmit={previewReceipt}>

        <input
          type="text"
          placeholder="Customer ID"
          name="customerId"
          value={form.customerId}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={form.amount}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option>Payment</option>
          <option>Deposit</option>
        </select>

        <br /><br />

        <button type="submit">
          Preview Receipt
        </button>

      </form>

      {receipt && <ReceiptPreview receipt={receipt} />}

    </div>
  );
}

export default PaymentValidation;