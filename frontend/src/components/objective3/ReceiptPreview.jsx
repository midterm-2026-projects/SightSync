function ReceiptPreview({ receipt }) {

  return (

    <div
      style={{
        marginTop: "20px",
        border: "1px dashed black",
        padding: "15px",
      }}
    >

      <h3>Receipt Preview</h3>

      <p>Receipt No: {receipt.receiptNo}</p>
      <p>Customer ID: {receipt.customerId}</p>
      <p>Transaction: {receipt.type}</p>
      <p>Amount: ₱{receipt.amount}</p>
      <p>Date: {receipt.date}</p>

      <hr />

      <p>Transaction Successfully Recorded</p>

    </div>

  );

}

export default ReceiptPreview;