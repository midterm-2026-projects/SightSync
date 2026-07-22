
import { useEffect, useMemo, useState } from 'react';
import { getPatients } from '../api/patientApi';
import { mapPatientsToRows } from '../utils/patientMapper';

export default function PatientList({ onSelectPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch patient records from the backend API
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatients();
      const patientList = data?.data || data || [];
      setPatients(Array.isArray(patientList) ? patientList : []);
    } catch (err) {
      setError(err.message || 'Failed to load patient records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Map API response items to UI row structures
  const rows = useMemo(() => mapPatientsToRows(patients), [patients]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery = `${row.fullName || ''} ${row.contactNumber || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || row.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [rows, searchQuery, statusFilter]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Patient Directory</h2>
          <p className="text-sm text-gray-500">Search and inspect patient records quickly.</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            aria-label="Search patients"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name or contact"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchPatients}
            className="text-xs font-semibold underline hover:text-red-900"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Patient</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Age</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Sex</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Contact</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading patient records...
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {error ? 'Could not load data.' : 'No patients found.'}
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => onSelectPatient?.(row.patient)}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{row.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{row.age}</td>
                  <td className="px-4 py-3 text-gray-600">{row.sex}</td>
                  <td className="px-4 py-3 text-gray-600">{row.contactNumber}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        row.status === 'Inactive'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {row.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
