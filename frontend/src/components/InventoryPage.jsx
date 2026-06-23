import InventoryTable from "./InventoryTable";
import InventoryForm from "./InventoryForm";

function InventoryPage() {
  return (
    <div>
      <h1>Inventory Management</h1>

      <InventoryForm />

      <br />

      <InventoryTable />
    </div>
  );
}

export default InventoryPage;