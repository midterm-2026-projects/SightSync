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

// ✅ Module E: Payments + Receipts (Day 2)
import PaymentsPanel from "./components/PaymentsPanel";

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

function App() {
  // --- STATE: Section Toggles ---
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    inventory: false,
    receipts: false,
    payments: false,
    communications: false,
    registration: false,
  });

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

  // --- TOGGLE HANDLER ---
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  // Prefill object passed to PaymentsPanel so it can inherit receipt state
  const receiptPrefill = { patientName, doctorName, odRx, osRx, items };

  return (
    <AppLayout>
      {(activeTab) => (
        <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
          {/* HEADER */}
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ marginBottom: "20px", color: "#1e293b" }}>System Modules</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <button
                onClick={() => toggleSection("dashboard")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: expandedSections.dashboard ? "#0ea5e9" : "#e2e8f0",
                  color: expandedSections.dashboard ? "white" : "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                📊 Dashboard {expandedSections.dashboard ? "▼" : "▶"}
              </button>
              <button
                onClick={() => toggleSection("inventory")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: expandedSections.inventory ? "#0ea5e9" : "#e2e8f0",
                  color: expandedSections.inventory ? "white" : "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                📦 Inventory {expandedSections.inventory ? "▼" : "▶"}
              </button>
              <button
                onClick={() => toggleSection("receipts")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: expandedSections.receipts ? "#0ea5e9" : "#e2e8f0",
                  color: expandedSections.receipts ? "white" : "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                🧾 Receipts {expandedSections.receipts ? "▼" : "▶"}
              </button>
              <button
                onClick={() => toggleSection("payments")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: expandedSections.payments ? "#0ea5e9" : "#e2e8f0",
                  color: expandedSections.payments ? "white" : "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                💰 Payments {expandedSections.payments ? "▼" : "▶"}
              </button>
              <button
                onClick={() => toggleSection("communications")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: expandedSections.communications ? "#0ea5e9" : "#e2e8f0",
                  color: expandedSections.communications ? "white" : "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                💬 Communications {expandedSections.communications ? "▼" : "▶"}
              </button>
              <button
                onClick={() => toggleSection("registration")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: expandedSections.registration ? "#0ea5e9" : "#e2e8f0",
                  color: expandedSections.registration ? "white" : "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                👤 Registration {expandedSections.registration ? "▼" : "▶"}
              </button>
            </div>
          </div>

          {/* SECTION: Dashboard */}
          {expandedSections.dashboard && (
            <div style={{
              marginBottom: "40px",
              padding: "24px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <h2 style={{ marginTop: 0, color: "#1e293b" }}>📊 Dashboard View</h2>
              <p>System initialized successfully. Core functional architecture is set.</p>
            </div>
          )}

          {/* SECTION: Inventory */}
          {expandedSections.inventory && (
            <div style={{
              marginBottom: "40px",
              padding: "24px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <h2 style={{ marginTop: 0, color: "#1e293b" }}>📦 Inventory Management</h2>
              <InventoryForm inventory={inventory} setInventory={setInventory} />
              <div style={{ marginTop: "24px" }}>
                <h3 style={{ color: "#1e293b" }}>Current Inventory</h3>
                <InventoryTable inventory={inventory} />
              </div>
            </div>
          )}

          {/* SECTION: Receipt Creation */}
          {expandedSections.receipts && (
            <div style={{
              marginBottom: "40px",
              padding: "24px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <h2 style={{ marginTop: 0, color: "#1e293b" }}>🧾 Receipt Creation Suite</h2>
              <div
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
            </div>
          )}

          {/* SECTION: Payments */}
          {expandedSections.payments && (
            <div style={{
              marginBottom: "40px",
              padding: "24px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <h2 style={{ marginTop: 0, color: "#1e293b" }}>💰 Payments + Receipt Generation</h2>
              <PaymentsPanel prefill={receiptPrefill} />
            </div>
          )}

          {/* SECTION: Communications */}
          {expandedSections.communications && (
            <div style={{
              marginBottom: "40px",
              padding: "24px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <h2 style={{ marginTop: 0, color: "#1e293b" }}>💬 Stakeholder Communication Board</h2>
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
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      marginTop: 0,
                      marginBottom: 16,
                      color: C?.text || "#1e293b",
                    }}
                  >
                    Sent Updates Feed
                  </h3>
                  <CommunicationLogs
                    currentUser={MOCK_USER}
                    logs={logs}
                    newId={newLogId}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: Patient Registration */}
          {expandedSections.registration && (
            <div style={{
              marginBottom: "40px",
              padding: "24px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <h2 style={{ marginTop: 0, color: "#1e293b" }}>👤 Patient Registration</h2>
              <PatientRegistrationForm />
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}

export default App;