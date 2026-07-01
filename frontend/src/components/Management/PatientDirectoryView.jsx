import { useState } from 'react';
import PatientList from './PatientList';
import PatientProfile from './PatientProfile';

const mockPatients = [
  {
    id: 1,
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    middleName: 'Santos',
    birthDate: '2000-01-01',
    age: 26,
    sex: 'Male',
    contactNumber: '09123456789',
    email: 'juan@example.com',
    address: 'Manila City',
    emergencyContact: 'Maria Dela Cruz',
    medicalHistory: 'None',
    status: 'Active',
  },
  {
    id: 2,
    firstName: 'Maria',
    lastName: 'Santos',
    middleName: 'Reyes',
    birthDate: '1995-03-10',
    age: 31,
    sex: 'Female',
    contactNumber: '09987654321',
    email: 'maria@example.com',
    address: 'Quezon City',
    emergencyContact: 'Rico Santos',
    medicalHistory: 'Asthma',
    status: 'Pending',
  },
];

export default function PatientDirectoryView() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);

  const handleProfileUpdate = (updatedProfile) => {
    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== selectedPatient?.id) {
          return patient;
        }

        return {
          ...patient,
          ...updatedProfile,
        };
      })
    );

    setSelectedPatient((prev) => prev ? { ...prev, ...updatedProfile } : prev);
  };

  return (
    <div className="space-y-6">
      <PatientList patients={patients} onSelectPatient={setSelectedPatient} />
      <PatientProfile patient={selectedPatient} onProfileUpdate={handleProfileUpdate} />
    </div>
  );
}
