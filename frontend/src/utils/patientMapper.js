/**
 * Maps the patient registration form into
 * the payload expected by the backend.
 *
 * @param {Object} formData
 * @returns {Object}
 */
export function mapPatientToPayload(formData) {
  return {
    first_name: (formData.firstName || '').trim(),
    last_name: (formData.lastName || '').trim(),
    middle_name: (formData.middleName || '').trim(),

    birth_date: formData.birthDate,
    age: Number(formData.age) || 0,
    sex: formData.sex,

    contact_number: (formData.contactNumber || '').trim(),
    email: (formData.email || '').trim(),
    address: (formData.address || '').trim(),

    emergency_contact: (formData.emergencyContact || '').trim(),
    medical_history: (formData.medicalHistory || '').trim(),
  };
}

export function mapPatientsToRows(patients = []) {
  if (!Array.isArray(patients)) {
    return [];
  }

  return patients.map((patient) => {
    if (!patient || typeof patient !== 'object') {
      return {
        id: 'unknown',
        fullName: 'Unknown Patient',
        age: '—',
        sex: '—',
        contactNumber: '—',
        status: 'Pending',
        patient: null,
      };
    }

    return {
      id: patient.id ?? patient.patientId ?? 'unknown',
      fullName: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient',
      age: patient.age ?? '—',
      sex: patient.sex ?? '—',
      contactNumber: patient.contactNumber ?? '—',
      status: patient.status ?? 'Pending',
      patient,
    };
  });
}

export function createPatientProfileForm(patient) {
  if (!patient || typeof patient !== 'object') {
    return {
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '',
      age: '',
      sex: '',
      contactNumber: '',
      email: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
    };
  }

  return {
    firstName: patient.firstName ?? '',
    lastName: patient.lastName ?? '',
    middleName: patient.middleName ?? '',
    birthDate: patient.birthDate ?? '',
    age: patient.age ?? '',
    sex: patient.sex ?? '',
    contactNumber: patient.contactNumber ?? '',
    email: patient.email ?? '',
    address: patient.address ?? '',
    emergencyContact: patient.emergencyContact ?? '',
    medicalHistory: patient.medicalHistory ?? '',
  };
}