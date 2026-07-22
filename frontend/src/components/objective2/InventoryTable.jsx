export default function InventoryTable({ inventory = [] }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Inventory List
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your current items, stock levels, and availability.
          </p>
        </div>
        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          Total Items: {inventory.length}
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Name</th>
              <th scope="col" className="px-6 py-3 font-medium">Type</th>
              <th scope="col" className="px-6 py-3 font-medium">Price</th>
              <th scope="col" className="px-6 py-3 font-medium">Stock</th>
              <th scope="col" className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {inventory.length > 0 ? (
              inventory.map((item) => {
                const isAvailable = item.stock > 0;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    {/* Name */}
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item.name}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 capitalize text-gray-500">
                      {item.type}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 text-gray-700">
                      {item.stock}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isAvailable
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            isAvailable ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {isAvailable ? "Available" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* Empty State */
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-400 italic"
                >
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}