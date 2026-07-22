
import { useEffect, useMemo, useState } from 'react';
import { updatePatient } from '../api/patientApi';
import { createPatientProfileForm, mapPatientToPayload } from '../utils/patientMapper';

export default function PatientProfile({ patient, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(() =>
    createPatientProfileForm(patient)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Sync internal form state whenever the selected patient prop changes
  useEffect(() => {
    if (patient) {
      setProfileForm(createPatientProfileForm(patient));
      setIsEditing(false);
      setError(null);
    }
  }, [patient]);

  const profileFields = useMemo(
    () => [
      { key: 'firstName', label: 'First Name', type: 'text' },
      { key: 'lastName', label: 'Last Name', type: 'text' },
      { key: 'middleName', label: 'Middle Name', type: 'text' },
      { key: 'birthDate', label: 'Birth Date', type: 'date' },
      { key: 'age', label: 'Age', type: 'number', readOnly: true },
      { key: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female', 'Prefer not to say'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
      { key: 'contactNumber', label: 'Contact Number', type: 'tel' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'emergencyContact', label: 'Emergency Contact', type: 'text' },
      { key: 'medicalHistory', label: 'Medical History', type: 'textarea' },
    ],
    []
  );

  const handleSave = async () => {
    if (!patient?.id) return;

    setIsSubmitting(true);
    setError(null);

    const payload = mapPatientToPayload(profileForm);

    try {
      // Call backend API update
      const updatedData = await updatePatient(patient.id, payload);

      // Notify parent component so it can refresh the list or state
      onProfileUpdate?.(updatedData || profileForm);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update patient profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!patient) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Patient Profile</h2>
        <p className="mt-2 text-sm text-gray-500">
          Select a patient to inspect or update their profile.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Patient Profile</h2>
          <p className="text-sm text-gray-500">
            Review and update selected patient details.
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setProfileForm(createPatientProfileForm(patient));
                setIsEditing(false);
                setError(null);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {profileFields.map((field) => {
          const isFullWidth = field.type === 'textarea';

          return (
            <div
              key={field.key}
              className={isFullWidth ? 'md:col-span-2' : 'col-span-1'}
            >
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {field.label}
              </label>

              {isEditing ? (
                field.type === 'select' ? (
                  <select
                    name={field.key}
                    value={profileForm[field.key] ?? ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    name={field.key}
                    rows={3}
                    value={profileForm[field.key] ?? ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 resize-none"
                  />
                ) : (
                  <input
                    name={field.key}
                    type={field.type}
                    readOnly={field.readOnly}
                    value={profileForm[field.key] ?? ''}
                    onChange={handleChange}
                    className={`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 ${field.readOnly ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                  />
                )
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {profileForm[field.key] || '—'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}