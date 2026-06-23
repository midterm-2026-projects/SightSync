function InventoryTable() {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Type</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Blue Cut Lens</td>
          <td>Lens</td>
          <td>1500</td>
          <td>20</td>
          <td>
            <button>Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default InventoryTable;