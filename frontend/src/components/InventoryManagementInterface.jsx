function InventoryManagementInterface() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Management</h1>

      <h2>Add Product</h2>

      <form>
        <input
          type="text"
          placeholder="Product Name"
        />

        <br />
        <br />

        <select>
          <option value="Lens">Lens</option>
          <option value="Frame">Frame</option>
        </select>

        <br />
        <br />

        <input
          type="number"
          placeholder="Price"
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Stock"
        />

        <br />
        <br />

        <button type="button">
          Add Product
        </button>
      </form>

      <hr />

      <h2>Inventory List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
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
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default InventoryManagementInterface;