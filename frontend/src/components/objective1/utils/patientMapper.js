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
    status: formData.status || "Active",

    contact_number: (formData.contactNumber || '').trim(),
    email: (formData.email || '').trim(),
    address: (formData.address || '').trim(),

    emergency_contact: (formData.emergencyContact || '').trim(),
    medical_history: (formData.medicalHistory || '').trim(),
  };
}
export function mapPatientsToRows(patients = []) {
  if (!Array.isArray(patients)) return [];

  return patients.map((patient) => {
    const firstName = patient.firstName || patient.first_name || '';
    const lastName = patient.lastName || patient.last_name || '';
    const middleName = patient.middleName || patient.middle_name || '';

    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(' ');

    return {
      id: patient.id || patient._id || Math.random(),
      fullName: fullName || 'N/A',
      age: patient.age ?? 'N/A',
      sex: patient.sex || 'N/A',
      contactNumber: patient.contactNumber || patient.contact_number || 'N/A',
      status: patient.status || 'Active',
      patient, 
    };
  });
}


export function createPatientProfileForm(patient) {
  if (!patient) {
    return {
      firstName: '',
      lastName: '',
      middleName: '',
      birthDate: '',
      age: '',
      sex: '',
      status: 'Active',
      contactNumber: '',
      email: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
    };
  }

  // 2. Safe Date formatting
  const rawDate = patient.birth_date || patient.birthDate || '';
  let formattedBirthDate = '';

  if (rawDate) {
    try {
      formattedBirthDate = new Date(rawDate).toISOString().split('T')[0];
    } catch {
      formattedBirthDate = '';
    }
  }

  // 3. Return mapped object
  return {
    firstName: patient.first_name || patient.firstName || '',
    lastName: patient.last_name || patient.lastName || '',
    middleName: patient.middle_name || patient.middleName || '',
    birthDate: formattedBirthDate,
    age: patient.age ?? '',
    sex: patient.sex || '',
    status: patient.status || 'Active',
    contactNumber: patient.contact_number || patient.contactNumber || '',
    email: patient.email || '',
    address: patient.address || '',
    emergencyContact: patient.emergency_contact || patient.emergencyContact || '',
    medicalHistory: patient.medical_history || patient.medicalHistory || '',
  };
}