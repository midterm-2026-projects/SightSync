
import AppLayout from './components/AppLayout';

export default function App() {
  return (
    <AppLayout>
      {(activeTab) => (
        <div>
          {activeTab === 'dashboard' && (
            <div>
              <h2>Dashboard View</h2>
              <p>System initialized successfully. Core functional architecture is set.</p>
            </div>
          )}
          {activeTab === 'patients' && (
            <div>
              <h2>Patient Placeholder</h2>
              <p>Patient sub-modules will mount within this child hook layer next week.</p>
            </div>
          )}
          {activeTab === 'appointments' && (
            <div>
              <h2>Appointments Placeholder</h2>
              <p>Appointment elements will be bound here during Week 4.</p>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
