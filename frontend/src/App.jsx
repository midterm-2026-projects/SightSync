import { useState } from "react";
import InventoryForm from "./components/InventoryForm";
import InventoryTable from "./components/InventoryTable";

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
    <div style={{ padding: "20px" }}>
      <h1>Inventory Management</h1>

      <InventoryForm
        inventory={inventory}
        setInventory={setInventory}
      />

      <InventoryTable
        inventory={inventory}
      />
    </div>
  );
}

export default App;