import { useState } from "react";
import InventoryForm from "./components/InventoryForm";
import InventoryTable from "./components/InventoryTable";
import inventoryData from "./data/inventoryData";

import AppLayout from "./components/AppLayout";
import PatientRegistrationForm from "./components/PatientRegistrationForm";

function App() {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Blue Cut Lens",
      type: "Lens",
      price: 1500,
      stock: 20,
    },
  ]);

  return (
    <AppLayout>
      {(activeTab) => (
        <div style={{ padding: "20px" }}>
          {activeTab === "dashboard" && (
            <>
              <h2>Dashboard View</h2>
              <p>
                System initialized successfully. Core functional architecture
                is set.
              </p>

              <hr />

              <h1>Inventory Management</h1>

              <InventoryForm
                inventory={inventory}
                setInventory={setInventory}
              />

              <InventoryTable inventory={inventory} />

              <hr />

              <h1>Inventory Monitoring</h1>

              <InventoryTable inventory={inventoryData} />
            </>
          )}

          {activeTab === "patients" && (
            <div>
              <h2>Patient Placeholder</h2>
              <p>
                Patient sub-modules will mount within this child hook layer
                next week.
              </p>
            </div>
          )}

          {activeTab === "appointments" && (
            <div>
              <h2>Appointments Placeholder</h2>
              <p>
                Appointment elements will be bound here during Week 4.
              </p>
            </div>
          )}

          {activeTab === "registration" && (
            <PatientRegistrationForm />
          )}
        </div>
      )}
    </AppLayout>
  );
}

export default App;