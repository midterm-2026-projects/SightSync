/**
 * Validates a patient registration form.
 *
 * @param {Object} formData
 * @returns {{
 *   valid: boolean,
 *   errors: Object
 * }}
 */

export function validatePatientForm(formData) {
  const errors = {};

  // -------------------------
  // Required Fields
  // -------------------------

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!formData.birthDate) {
    errors.birthDate = "Birth date is required.";
  }

  if (!formData.sex) {
    errors.sex = "Sex is required.";
  }

  if (!formData.contactNumber.trim()) {
    errors.contactNumber = "Contact number is required.";
  }

  if (!formData.address.trim()) {
    errors.address = "Address is required.";
  }

  // -------------------------
  // Email Validation
  // -------------------------

  if (formData.email.trim()) {
    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // -------------------------
  // Contact Number Validation
  // -------------------------

  if (formData.contactNumber.trim()) {
    const contactRegex = /^[0-9+\-\s()]+$/;

    if (!contactRegex.test(formData.contactNumber)) {
      errors.contactNumber =
        "Contact number contains invalid characters.";
    }

    const digits = formData.contactNumber.replace(/\D/g, "");

    if (digits.length < 10 || digits.length > 15) {
      errors.contactNumber =
        "Contact number must contain 10–15 digits.";
    }
  }

  // -------------------------
  // Birth Date Validation
  // -------------------------

  if (formData.birthDate) {
    const birthDate = new Date(formData.birthDate);
    const today = new Date();

    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      errors.birthDate =
        "Birth date cannot be in the future.";
    }
  }

  // -------------------------
  // Name Validation
  // -------------------------

  const nameRegex = /^[A-Za-z\s'-]+$/;

  if (
    formData.firstName &&
    !nameRegex.test(formData.firstName)
  ) {
    errors.firstName =
      "First name contains invalid characters.";
  }

  if (
    formData.lastName &&
    !nameRegex.test(formData.lastName)
  ) {
    errors.lastName =
      "Last name contains invalid characters.";
  }

  if (
    formData.middleName &&
    !nameRegex.test(formData.middleName)
  ) {
    errors.middleName =
      "Middle name contains invalid characters.";
  }

  // -------------------------
  // Return Result
  // -------------------------

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}