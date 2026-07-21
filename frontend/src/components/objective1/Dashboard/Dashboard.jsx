// import React, { useState, useEffect } from 'react';
// import { getPatients } from '../api/patientApi';
// import { getAllAppointments } from '../services/appointmentService';

// export default function Dashboard({ onNavigateToAppointments, onNavigateToPatients }) {
//   const [patients, setPatients] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [patientsData, appointmentsData] = await Promise.all([
//         getPatients(),
//         getAllAppointments(),
//       ]);

//       setPatients(Array.isArray(patientsData) ? patientsData : patientsData.data || []);
//       setAppointments(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.data || []);
//     } catch (err) {
//       setError(err.message || 'Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   // Compute Summary Metrics
//   const totalPatients = patients.length;
//   const totalAppointments = appointments.length;

//   const scheduledCount = appointments.filter((a) => a.status === 'Scheduled').length;
//   const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
//   const completedCount = appointments.filter((a) => a.status === 'Completed').length;
//   const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

//   // Recent 5 Appointments
//   const recentAppointments = [...appointments]
//     .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
//     .slice(0, 5);

//   // Recent 5 Patients
//   const recentPatients = [...patients].reverse().slice(0, 5);

//   const getStatusBadge = (status) => {
//     const styles = {
//       Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
//       Scheduled: 'bg-indigo-100 text-indigo-800 border-indigo-200',
//       Pending: 'bg-amber-100 text-amber-800 border-amber-200',
//       Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
//     };
//     return (
//       <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
//         {status}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="p-12 text-center text-slate-500 font-medium">Loading dashboard overview...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
//           <p className="text-sm text-slate-500 mt-1">Welcome back. Here is what is happening across your clinic today.</p>
//         </div>
//         <button
//           onClick={fetchDashboardData}
//           className="px-3.5 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium text-sm rounded-lg transition-colors"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex justify-between items-center" name="error-alert">
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="font-bold hover:text-rose-900">✕</button>
//         </div>
//       )}

//       {/* Metric Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Card 1: Total Patients */}
//         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
//           <div className="flex justify-between items-center text-slate-500">
//             <span className="text-xs font-semibold uppercase tracking-wider">Total Patients</span>
//             <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">👥</span>
//           </div>
//           <div className="text-3xl font-bold text-slate-900">{totalPatients}</div>
//           <p className="text-xs text-slate-400">Registered in system</p>
//         </div>

//         {/* Card 2: Total Appointments */}
//         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
//           <div className="flex justify-between items-center text-slate-500">
//             <span className="text-xs font-semibold uppercase tracking-wider">Appointments</span>
//             <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-lg">📅</span>
//           </div>
//           <div className="text-3xl font-bold text-slate-900">{totalAppointments}</div>
//           <p className="text-xs text-slate-400">All-time recorded</p>
//         </div>

//         {/* Card 3: Scheduled */}
//         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
//           <div className="flex justify-between items-center text-slate-500">
//             <span className="text-xs font-semibold uppercase tracking-wider">Scheduled</span>
//             <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">⏳</span>
//           </div>
//           <div className="text-3xl font-bold text-indigo-600">{scheduledCount}</div>
//           <p className="text-xs text-slate-400">Upcoming visits</p>
//         </div>

//         {/* Card 4: Pending Action */}
//         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
//           <div className="flex justify-between items-center text-slate-500">
//             <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
//             <span className="p-2 bg-amber-50 text-amber-600 rounded-lg text-lg">⚠️</span>
//           </div>
//           <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
//           <p className="text-xs text-slate-400">Awaiting confirmation</p>
//         </div>
//       </div>

//       {/* Appointment Breakdown Progress Bar */}
//       {totalAppointments > 0 && (
//         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
//           <h2 className="text-sm font-semibold text-slate-700">Appointment Status Breakdown</h2>
//           <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
//             <div
//               style={{ width: `${(scheduledCount / totalAppointments) * 100}%` }}
//               className="bg-indigo-500"
//               title={`Scheduled: ${scheduledCount}`}
//             />
//             <div
//               style={{ width: `${(completedCount / totalAppointments) * 100}%` }}
//               className="bg-emerald-500"
//               title={`Completed: ${completedCount}`}
//             />
//             <div
//               style={{ width: `${(pendingCount / totalAppointments) * 100}%` }}
//               className="bg-amber-500"
//               title={`Pending: ${pendingCount}`}
//             />
//             <div
//               style={{ width: `${(cancelledCount / totalAppointments) * 100}%` }}
//               className="bg-rose-500"
//               title={`Cancelled: ${cancelledCount}`}
//             />
//           </div>
//           <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
//             <div className="flex items-center gap-1.5">
//               <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Scheduled ({scheduledCount})
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Completed ({completedCount})
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Pending ({pendingCount})
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Cancelled ({cancelledCount})
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Content Grid: Recent Appointments + Recent Patients */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column (2 Cols): Recent Appointments */}
//         <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//           <div className="p-5 border-b border-slate-100 flex justify-between items-center">
//             <h2 className="font-bold text-slate-900">Recent Appointments</h2>
//             {onNavigateToAppointments && (
//               <button
//                 onClick={onNavigateToAppointments}
//                 className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
//               >
//                 View All →
//               </button>
//             )}
//           </div>

//           <div className="divide-y divide-slate-100 flex-1">
//             {recentAppointments.length === 0 ? (
//               <div className="p-8 text-center text-slate-400 text-sm">No appointments scheduled yet.</div>
//             ) : (
//               recentAppointments.map((apt) => {
//                 const patient = patients.find((p) => String(p.id) === String(apt.patient_id));
//                 const patientName = patient
//                   ? patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
//                   : `Patient #${apt.patient_id}`;

//                 return (
//                   <div key={apt.id} className="p-4 hover:bg-slate-50/80 transition-colors flex justify-between items-center gap-4">
//                     <div className="space-y-1">
//                       <div className="font-medium text-slate-900 text-sm">{patientName}</div>
//                       <div className="text-xs text-slate-400 flex items-center gap-2">
//                         <span>{apt.appointment_type || 'Consultation'}</span>
//                         <span>•</span>
//                         <span>{apt.reason || 'No reason provided'}</span>
//                       </div>
//                     </div>

//                     <div className="text-right space-y-1">
//                       <div className="text-xs font-medium text-slate-700">
//                         {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : 'N/A'}
//                       </div>
//                       <div>{getStatusBadge(apt.status)}</div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>

//         {/* Right Column (1 Col): Recent Patients */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//           <div className="p-5 border-b border-slate-100 flex justify-between items-center">
//             <h2 className="font-bold text-slate-900">Recently Added Patients</h2>
//             {onNavigateToPatients && (
//               <button
//                 onClick={onNavigateToPatients}
//                 className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
//               >
//                 View All →
//               </button>
//             )}
//           </div>

//           <div className="divide-y divide-slate-100 flex-1">
//             {recentPatients.length === 0 ? (
//               <div className="p-8 text-center text-slate-400 text-sm">No patients registered.</div>
//             ) : (
//               recentPatients.map((patient) => {
//                 const fullName = patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || `Patient #${patient.id}`;

//                 return (
//                   <div key={patient.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
//                         {fullName.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-slate-900">{fullName}</div>
//                         <div className="text-xs text-slate-400">{patient.email || patient.phone || `ID: ${patient.id}`}</div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { getPatients } from '../api/patientApi';
import { getAllAppointments } from '../services/appointmentService';

export default function Dashboard({ onNavigateToAppointments, onNavigateToPatients }) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [patientsData, appointmentsData] = await Promise.all([
        getPatients(),
        getAllAppointments(),
      ]);

      setPatients(Array.isArray(patientsData) ? patientsData : patientsData.data || []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute Metrics
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;

  const scheduledCount = appointments.filter((a) => a.status === 'Scheduled').length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  // Recent Items
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    .slice(0, 5);

  const recentPatients = [...patients].reverse().slice(0, 5);

  const getStatusDot = (status) => {
    const config = {
      Completed: { bg: 'bg-emerald-500', text: 'text-emerald-700' },
      Scheduled: { bg: 'bg-zinc-900', text: 'text-zinc-800' },
      Pending: { bg: 'bg-amber-500', text: 'text-amber-700' },
      Cancelled: { bg: 'bg-zinc-300', text: 'text-zinc-400' },
    };

    const current = config[status] || { bg: 'bg-zinc-400', text: 'text-zinc-600' };

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${current.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${current.bg}`} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-200/60 rounded-md w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-zinc-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 font-sans text-zinc-900">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Overview of clinic status and recent activities.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/70 rounded-md transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50/50 border border-red-200/60 text-red-700 rounded-lg text-xs flex justify-between items-center" name="error-alert">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:opacity-75">✕</button>
        </div>
      )}

      {/* Minimal Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-zinc-200/80 bg-white">
          <span className="text-xs font-medium text-zinc-400">Total Patients</span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1">{totalPatients}</div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200/80 bg-white">
          <span className="text-xs font-medium text-zinc-400">Total Appointments</span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1">{totalAppointments}</div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200/80 bg-white">
          <span className="text-xs font-medium text-zinc-400">Scheduled</span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1">{scheduledCount}</div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200/80 bg-white">
          <span className="text-xs font-medium text-zinc-400">Pending Approval</span>
          <div className="text-2xl font-semibold text-amber-600 mt-1">{pendingCount}</div>
        </div>
      </div>

      {/* Status Proportion Bar */}
      {totalAppointments > 0 && (
        <div className="p-5 rounded-xl border border-zinc-200/80 bg-white space-y-3">
          <div className="flex justify-between items-center text-xs text-zinc-500 font-medium">
            <span>Appointment Distribution</span>
            <span>{totalAppointments} total</span>
          </div>

          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden flex">
            <div style={{ width: `${(scheduledCount / totalAppointments) * 100}%` }} className="bg-zinc-900" />
            <div style={{ width: `${(completedCount / totalAppointments) * 100}%` }} className="bg-emerald-500" />
            <div style={{ width: `${(pendingCount / totalAppointments) * 100}%` }} className="bg-amber-500" />
            <div style={{ width: `${(cancelledCount / totalAppointments) * 100}%` }} className="bg-zinc-300" />
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-zinc-500 pt-1">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-900" /> Scheduled ({scheduledCount})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed ({completedCount})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending ({pendingCount})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-300" /> Cancelled ({cancelledCount})</span>
          </div>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 border border-zinc-200/80 rounded-xl bg-white overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-zinc-900">Recent Appointments</h2>
            {onNavigateToAppointments && (
              <button
                onClick={onNavigateToAppointments}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                View all →
              </button>
            )}
          </div>

          <div className="divide-y divide-zinc-100 flex-1">
            {recentAppointments.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">No appointments found.</div>
            ) : (
              recentAppointments.map((apt) => {
                const patient = patients.find((p) => String(p.id) === String(apt.patient_id));
                const patientName = patient
                  ? patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
                  : `Patient #${apt.patient_id}`;

                return (
                  <div key={apt.id} className="p-4 hover:bg-zinc-50/60 transition-colors flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-zinc-900">{patientName}</div>
                      <div className="text-[11px] text-zinc-400">
                        {apt.appointment_type || 'Consultation'} &middot; {apt.reason || 'Routine Checkup'}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-[11px] text-zinc-500">
                        {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : 'N/A'}
                      </div>
                      <div>{getStatusDot(apt.status)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="border border-zinc-200/80 rounded-xl bg-white overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-zinc-900">Recent Patients</h2>
            {onNavigateToPatients && (
              <button
                onClick={onNavigateToPatients}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                View all →
              </button>
            )}
          </div>

          <div className="divide-y divide-zinc-100 flex-1">
            {recentPatients.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">No patients registered.</div>
            ) : (
              recentPatients.map((patient) => {
                const fullName = patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || `Patient #${patient.id}`;

                return (
                  <div key={patient.id} className="p-4 hover:bg-zinc-50/60 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-700 font-semibold text-xs flex items-center justify-center border border-zinc-200/50">
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-zinc-900">{fullName}</div>
                        <div className="text-[11px] text-zinc-400">{patient.email || patient.phone || `ID: #${patient.id}`}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}