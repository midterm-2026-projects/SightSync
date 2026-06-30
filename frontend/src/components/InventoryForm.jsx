import { useState } from "react";

function InventoryForm({
  inventory,
  setInventory,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Lens");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !stock) {
      alert("Please complete all fields.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      type,
      price: Number(price),
      stock: Number(stock),
    };

    setInventory([
      ...inventory,
      newProduct,
    ]);

    setName("");
    setType("Lens");
    setPrice("");
    setStock("");
  };

  return (
    <>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br />
        <br />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option value="Lens">
            Lens
          </option>

          <option value="Frame">
            Frame
          </option>
        </select>

        <br />
        <br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Add Product
        </button>
      </form>
    </>
  );
}

export default InventoryForm;