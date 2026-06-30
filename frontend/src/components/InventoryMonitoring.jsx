import inventoryData from "../data/inventoryData";
import InventoryTable from "./InventoryTable";

function InventoryMonitoring() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Monitoring</h1>

      <InventoryTable
        inventory={inventoryData}
      />
    </div>
  );
}

export default InventoryMonitoring;