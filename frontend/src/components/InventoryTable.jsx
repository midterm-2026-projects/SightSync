function InventoryTable({ inventory }) {
  return (
    <>
      <h2>Inventory List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.price}</td>
              <td>{item.stock}</td>

              <td>
                {item.stock > 0
                  ? "Available"
                  : "Out of Stock"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default InventoryTable;