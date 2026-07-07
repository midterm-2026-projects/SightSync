import { useState } from 'react';
import InventoryForm from '../objective2/InventoryForm';
import InventoryTable from '../InventoryTable';
import PatientDirectoryView from './PatientDirectoryView';
import PatientRegistrationForm from '../Registration/PatientRegistrationForm';

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
      case 'appointments':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Appointment Schedules</h2>
            <p className="mt-2 text-sm text-gray-500">Appointment workflows will be mounted here in the upcoming sprint.</p>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
            <p className="mt-2 text-sm text-gray-500">System initialized successfully. Core functional architecture is now mounted through the shared layout.</p>
          </div>
        );
    }
  };

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
              <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100" onClick={() => setActiveTab('dashboard')}>
                Dashboard Overview
              </button>
            </li>
            <li>
              <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100" onClick={() => setActiveTab('inventory')}>
                Inventory Management
              </button>
            </li>
            <li>
              <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100" onClick={() => setActiveTab('patients')}>
                Patient Management (W2)
              </button>
            </li>
            <li>
              <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100" onClick={() => setActiveTab('registration')}>
                Patient Registration
              </button>
            </li>
            <li>
              <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100" onClick={() => setActiveTab('appointments')}>
                Appointment Schedules (W4)
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-8 text-sm text-gray-500">Module Owner: Lalo, J.P.</div>
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
