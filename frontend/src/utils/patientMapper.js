/**
 * Maps the patient registration form into
 * the payload expected by the backend.
 *
 * @param {Object} formData
 * @returns {Object}
 */
export function mapPatientToPayload(formData) {
  return {
    first_name: formData.firstName.trim(),
    last_name: formData.lastName.trim(),
    middle_name: formData.middleName.trim(),

    birth_date: formData.birthDate,
    age: Number(formData.age) || 0,
    sex: formData.sex,

    contact_number: formData.contactNumber.trim(),
    email: formData.email.trim(),
    address: formData.address.trim(),

    emergency_contact: formData.emergencyContact.trim(),
    medical_history: formData.medicalHistory.trim(),
  };
}