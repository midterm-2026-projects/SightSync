import { useMemo, useState } from 'react';
import { mapPatientsToRows } from '../../utils/patientMapper';

const defaultPatients = [
  {
    id: 1,
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    age: 26,
    sex: 'Male',
    contactNumber: '09123456789',
    status: 'Active',
    email: 'juan@example.com',
    address: 'Manila City',
    birthDate: '2000-01-01',
    emergencyContact: 'Maria Dela Cruz',
    medicalHistory: 'None',
  },
  {
    id: 2,
    firstName: 'Maria',
    lastName: 'Santos',
    age: 31,
    sex: 'Female',
    contactNumber: '09987654321',
    status: 'Pending',
    email: 'maria@example.com',
    address: 'Quezon City',
    birthDate: '1995-03-10',
    emergencyContact: 'Rico Santos',
    medicalHistory: 'Asthma',
  },
];

export default function PatientList({ patients = defaultPatients, onSelectPatient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const rows = useMemo(() => mapPatientsToRows(patients), [patients]);

  const filteredRows = rows.filter((row) => {
    const matchesQuery = `${row.fullName} ${row.contactNumber}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || row.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

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
            className="rounded-lg border border-gray-300 px-3 py-2"
          />

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

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
            {filteredRows.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectPatient?.(row.patient)}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{row.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{row.age}</td>
                <td className="px-4 py-3 text-gray-600">{row.sex}</td>
                <td className="px-4 py-3 text-gray-600">{row.contactNumber}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
