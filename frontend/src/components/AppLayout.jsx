

import { useState } from 'react';
import InventoryForm from './objective2/InventoryForm';
import InventoryTable from './objective2/InventoryTable';
import PatientDirectoryView from './objective1/Management/PatientDirectoryView';
import PatientRegistrationForm from './objective1/Registration/PatientRegistrationForm';
import AppointmentManager from './objective1/Appointments/AppointmentManager';
import AppObjective3 from './objective3/AppReceipt/AppObjective3.jsx';
import Dashboard from "./objective1/Dashboard/Dashboard.jsx"
import PredictionDashboard from "./objective2/PredictionDashboard";

export default function AppLayout({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Blue Cut Lens',
      type: 'Lens',
      price: 1500,
      stock: 20,
    },
  ]);

  const renderContent = () => {
    if (children) {
      return children(activeTab);
    }

    switch (activeTab) {
      case 'inventory':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Inventory Management</h2>
              <p className="text-sm text-gray-500">Track stock levels and product entry for the clinic.</p>
            </div>
            <InventoryForm inventory={inventory} setInventory={setInventory} />
            <InventoryTable inventory={inventory} />
          </div>
        );
      case 'patients':
        return <PatientDirectoryView />;
      case 'registration':
        return <PatientRegistrationForm />;
      case 'receipts':
        return <AppObjective3 />;
      case 'appointments':
        return (
          <AppointmentManager />
        );

      case "prediction":
          return <PredictionDashboard />;
        
      case 'dashboard':
      default:
        return (
          <Dashboard />
        );
    }
  };

  const getButtonClass = (tabName) =>
    `w-full rounded-lg px-3 py-2 text-left transition-colors ${
      activeTab === tabName ? 'bg-gray-200 font-medium text-gray-900' : 'hover:bg-gray-100 text-gray-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="w-full bg-white p-6 shadow-sm md:w-72 md:min-h-screen md:fixed">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">SightSync</h2>
          <small className="text-gray-500">Clinic Management Suite</small>
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <button className={getButtonClass('dashboard')} onClick={() => setActiveTab('dashboard')}>
                Dashboard Overview
              </button>
            </li>
            <li>
              <button className={getButtonClass('inventory')} onClick={() => setActiveTab('inventory')}>
                Inventory Management
              </button>
            </li>
            <li>
              <button className={getButtonClass('patients')} onClick={() => setActiveTab('patients')}>
                Patient Management
              </button>
            </li>
            <li>
              <button className={getButtonClass('registration')} onClick={() => setActiveTab('registration')}>
                Patient Registration
              </button>
            </li>
            <li>
              <button className={getButtonClass('receipts')} onClick={() => setActiveTab('receipts')}>
                Receipt Generator
              </button>
            </li>
            <li>
              <button className={getButtonClass('appointments')} onClick={() => setActiveTab('appointments')}>
                Appointment Schedules
              </button>
            </li>
            <li>
              <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100" onClick={() => setActiveTab('prediction')}>
                Prediction Dashboard
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-8 text-sm text-gray-500">SightSync 2026</div>
      </aside>

      <div className="md:ml-72">
        <header className="border-b border-gray-200 bg-white px-6 py-5">
          <h1 className="text-2xl font-semibold text-gray-900">Patient & Appointment Management</h1>
          <div className="text-sm text-gray-500">Status: Frontend Init</div>
        </header>

        <main className="p-6" data-testid="workspace-canvas">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}