function InventoryForm() {
  return (
    <form>
      <h3>Add Product</h3>

      <input
        type="text"
        placeholder="Product Name"
      />

      <input
        type="number"
        placeholder="Price"
      />

      <input
        type="number"
        placeholder="Stock"
      />

      <button type="submit">
        Save
      </button>
    </form>
  );
}

export default InventoryForm;