import { useMemo, useState } from 'react';
import { createPatientProfileForm } from '../../utils/patientMapper';

export default function PatientProfile({ patient, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(() => createPatientProfileForm(patient));

  const profileFields = useMemo(
    () => [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'middleName', label: 'Middle Name' },
      { key: 'birthDate', label: 'Birth Date' },
      { key: 'age', label: 'Age' },
      { key: 'sex', label: 'Sex' },
      { key: 'contactNumber', label: 'Contact Number' },
      { key: 'email', label: 'Email' },
      { key: 'address', label: 'Address' },
      { key: 'emergencyContact', label: 'Emergency Contact' },
      { key: 'medicalHistory', label: 'Medical History' },
    ],
    []
  );

  const handleToggle = () => {
    if (isEditing) {
      onProfileUpdate?.(profileForm);
    }

    setIsEditing((prev) => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!patient) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Patient Profile</h2>
        <p className="mt-2 text-sm text-gray-500">Select a patient to inspect or update their profile.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Patient Profile</h2>
          <p className="text-sm text-gray-500">Review and update selected patient details.</p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {profileFields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label>
            {isEditing ? (
              <input
                name={field.key}
                value={profileForm[field.key] ?? ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                type={field.key === 'age' ? 'number' : 'text'}
              />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                {profileForm[field.key] ?? '—'}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
