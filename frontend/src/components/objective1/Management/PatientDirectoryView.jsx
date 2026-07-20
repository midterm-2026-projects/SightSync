
import { useEffect, useRef, useState } from 'react';
import PatientList from './PatientList';
import PatientProfile from './PatientProfile';

export default function PatientDirectoryView() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const listRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInList = listRef.current?.contains(event.target);
      const clickedInProfile = profileRef.current?.contains(event.target);

      // If click was outside both the list AND the profile view, reset state
      if (!clickedInList && !clickedInProfile) {
        setSelectedPatient(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectPatient = (patient) => {
    // Toggle feature: If user clicks the already selected patient, deselect them
    setSelectedPatient((prev) => (prev?.id === patient?.id ? null : patient));
  };

  const handleProfileUpdate = (updatedPatientData) => {
    setSelectedPatient((prev) => ({
      ...prev,
      ...updatedPatientData,
    }));
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div ref={listRef}>
        <PatientList
          key={refreshKey}
          selectedPatientId={selectedPatient?.id}
          onSelectPatient={handleSelectPatient}
        />
      </div>

      <div ref={profileRef}>
        <PatientProfile
          patient={selectedPatient}
          onProfileUpdate={handleProfileUpdate}
          onClose={() => setSelectedPatient(null)}
        />
      </div>
    </div>
  );
}