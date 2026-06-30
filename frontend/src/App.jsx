import { useState } from "react";

// Module A: Stakeholder Communication
import Compose from "./components/Compose";
import CommunicationLogs from "./components/CommunicationLogs";

// Module B: Optometry Receipt Creator
import ReceiptForm from "./components/ReceiptForm";
import ReceiptLayout from "./components/ReceiptLayout";

// Module C: Inventory Management
import InventoryForm from "./components/InventoryForm";
import InventoryTable from "./components/InventoryTable";

// Module D: Layout / Patient Registration
import AppLayout from "./components/AppLayout";
import PatientRegistrationForm from "./components/PatientRegistrationForm";

// Constants from sub-components context
import { C } from "./components/receiptConstants";

// --- Mock Config for Messaging Module ---
const MOCK_USER = {
  id: "USR-001",
  name: "Dr. Sarah Jenkins",
  role: "admin",
};

const INITIAL_LOGS = [
  {
    id: "log_1719170000000",
    subject: "Initial Q3 Laboratory Milestone",
    senderName: "Dr. Sarah Jenkins",
    senderId: "USR-001",
    senderRole: "admin",
    recipients: ["board", "investors"],
    timestamp: "2026-06-23T14:30:00.000Z",
    content:
      "All clinical machinery benchmarks for our optometry suites have met standard expectations ahead of the targeted timeline.",
  },
];

const INITIAL_INVENTORY = [
  {
    id: 1,
    name: "Blue Cut Lens",
    type: "Lens",
    price: 1500,
    stock: 20,
  },
];

export default function App() {
  // Global View Navigation State
  // "receipts" | "communications" | "dashboard" | "inventory" | "registration"
  const [activeTab, setActiveTab] = useState("receipts");

  // --- STATE: Communication ---
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [newLogId, setNewLogId] = useState(null);

  // --- STATE: Receipt Form ---
  const [patientName, setPatientName] = useState("John Doe");
  const [doctorName, setDoctorName] = useState("Dr. Sarah Jenkins, OD");
  const [date, setDate] = useState("2026-06-23");
  const [receiptNumber, setReceiptNumber] = useState("EYE-20260623-NU13");
  const [odRx, setOdRx] = useState("Sph -2.50 / Cyl -0.50 x 180");
  const [osRx, setOsRx] = useState("Sph -2.25 / DS");
  const [items, setItems] = useState([
    { name: "Anti-Reflective Lenses (1.61)", quantity: 1, price: 120.0 },
    { name: "Designer Frame - Matte Black", quantity: 1, price: 145.0 },
  ]);

  // --- STATE: Inventory ---
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  // --- HANDLERS: Communication ---
  const handleSendMessage = (messageData) => {
    const generatedId = `log_${Date.now()}`;
    const newLogItem = {
      id: generatedId,
      subject: messageData.subject,
      senderName: MOCK_USER.name,
      senderId: MOCK_USER.id,
      senderRole: MOCK_USER.role,
      recipients: messageData.recipients,
      timestamp: new Date().toISOString(),
      content: messageData.content,
    };

    setLogs((prevLogs) => [newLogItem, ...prevLogs]);
    setNewLogId(generatedId);
    setTimeout(() => setNewLogId(null), 2500);
  };

  // --- HANDLERS: Receipt Form ---
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "name" ? value : value === "" ? "" : Number(value);
    setItems(updatedItems);
  };

  const handlePrint = () => {
    window.print();
  };

  const TABS = [
    { key: "receipts", label: "📄 Receipt Engine" },
    { key: "communications", label: "💬 Communications Panel" },
    { key: "dashboard", label: "🏠 Dashboard" },
    { key: "inventory", label: "📦 Inventory" },
    { key: "registration", label: "🧾 Patient Registration" },
  ];

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Navigation Header (hidden during printing) */}
      <header
        className="no-print"
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: "18px", color: "#0f766e" }}>
            SightSync Clinic Suite
          </span>
          <nav style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  background: activeTab === tab.key ? "#0f766e" : "transparent",
                  color: activeTab === tab.key ? "#fff" : "#64748b",
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Primary Workspace Container */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* VIEW: Receipt Creation Suite */}
        {activeTab === "receipts" && (
          <div
            className="app-container"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            <ReceiptForm
              patientName={patientName}
              setPatientName={setPatientName}
              doctorName={doctorName}
              setDoctorName={setDoctorName}
              date={date}
              setDate={setDate}
              receiptNumber={receiptNumber}
              setReceiptNumber={setReceiptNumber}
              odRx={odRx}
              setOdRx={setOdRx}
              osRx={osRx}
              setOsRx={setOsRx}
              items={items}
              handleItemChange={handleItemChange}
              handlePrint={handlePrint}
            />
            <ReceiptLayout
              patientName={patientName}
              doctorName={doctorName}
              date={date}
              receiptNumber={receiptNumber}
              odRx={odRx}
              osRx={osRx}
              items={items}
            />
          </div>
        )}

        {/* VIEW: Stakeholder Communication Board */}
        {activeTab === "communications" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            <div>
              <Compose currentUser={MOCK_USER} onSend={handleSendMessage} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  marginTop: 0,
                  marginBottom: 16,
                  color: C?.text || "#1e293b",
                }}
              >
                Sent Updates Feed
              </h2>
              <CommunicationLogs
                currentUser={MOCK_USER}
                logs={logs}
                newId={newLogId}
              />
            </div>
          </div>
        )}

        {/* VIEW: Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h2>Dashboard View</h2>
            <p>System initialized successfully. Core functional architecture is set.</p>
          </div>
        )}

        {/* VIEW: Inventory Management */}
        {activeTab === "inventory" && (
          <div>
            <h1>Inventory Management</h1>
            <InventoryForm inventory={inventory} setInventory={setInventory} />
            <InventoryTable inventory={inventory} />
          </div>
        )}

        {/* VIEW: Patient Registration */}
        {activeTab === "registration" && <PatientRegistrationForm />}
      </main>
    </div>
  );
}