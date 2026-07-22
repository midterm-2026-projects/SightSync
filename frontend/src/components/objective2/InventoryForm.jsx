import { useState } from "react";

export default function InventoryForm({ inventory = [], setInventory }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Lens");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !stock) {
      setError("Please complete all fields.");
      return;
    }

    if (Number(price) <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    if (Number(stock) < 0) {
      setError("Stock quantity cannot be negative.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      type,
      price: Number(price),
      stock: Number(stock),
    };

    setInventory([...inventory, newProduct]);

    // Reset Form
    setName("");
    setType("Lens");
    setPrice("");
    setStock("");
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-xl font-semibold text-gray-800">Add Product</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter product details to add new items to your inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Inline Error Alert */}
        {error && (
          <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-rose-500 hover:text-rose-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
            Product Name
          </label>
          <input
            type="text"
            placeholder="e.g. Classic Aviator"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Category / Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
            Product Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700 cursor-pointer"
          >
            <option value="Lens">Lens</option>
            <option value="Frame">Frame</option>
          </select>
        </div>

        {/* Price & Stock Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Price ($)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-7 pr-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Stock Quantity
            </label>
            <input
              type="number"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}