import { useState } from 'react';

export default function AppLayout({ children }) {
  // Local state to manage navigation switching between views
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div>
      
      {/* Sidebar Navigation Drawer Shell */}
      <aside>
        <div>
          <h2>SightSync</h2>
          <small>Clinic Management Suite</small>
        </div>

        <nav>
          <ul>
            <li>
              <button onClick={() => setActiveTab('dashboard')}>
                Dashboard Overview
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('patients')}>
                Patient Management (W2)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('appointments')}>
                Appointment Schedules (W4)
              </button>
            </li>
          </ul>
        </nav>

        <div>
          Module Owner: Lalo, J.P.
        </div>
      </aside>

      {/* Main Content View Frame */}
      <div>
        <header>
          <h1>Patient & Appointment Management</h1>
          <div>
            Status: Frontend Init
          </div>
        </header>

        <main data-testid="workspace-canvas">
          {/* Dynamically pass down the active selection string to child layouts */}
          {children(activeTab)}
        </main>
      </div>

    </div>
  );
}