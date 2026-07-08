<<<<<<< HEAD
import { useState } from "react";

// Module A: Stakeholder Communication
import Compose from "./components/objective3/Compose";
import CommunicationLogs from "./components/objective3/CommunicationLogs";

// Module B: Optometry Receipt Creator
import ReceiptForm from "./components/objective3/ReceiptForm";
import ReceiptLayout from "./components/objective3/ReceiptLayout";

// Module C: Inventory Management
import InventoryForm from "./components/InventoryForm";
import InventoryTable from "./components/InventoryTable"; 

// Module D: Layout / Patient Registration
import AppLayout from "./components/AppLayout";
import PatientRegistrationForm from "./components/PatientRegistrationForm";

// ✅ Module E: Payments + Receipts (Day 2)
import PaymentsPanel from "./components/objective3/PaymentsPanel";

// Constants from sub-components context
import { C } from "./components/objective3/receiptConstants";
import PaymentValidation from "./components/objective3/PaymentValidation";

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
=======
import AppLayout from './components/Management/AppLayout.jsx';
>>>>>>> c04023656f72b844afca9ad97aaf241f23b204c5

export default function App() {
  return (
    <AppLayout/>
  );
<<<<<<< HEAD
  
  function App() {
  return <PaymentValidation />;
}
}

export default App;
=======
}
>>>>>>> c04023656f72b844afca9ad97aaf241f23b204c5
