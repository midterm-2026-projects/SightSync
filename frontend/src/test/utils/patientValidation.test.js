import { describe, expect, it } from 'vitest';
import { validatePatientForm } from '../../utils/patientValidation';

const validFormData = {
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
};

describe('validatePatientForm', () => {
  it('should return valid when all required patient data is acceptable', () => {
    expect(validatePatientForm(validFormData)).toEqual({
      valid: true,
      errors: {},
    });
  });

  it('should return required field errors when required values are missing', () => {
    const result = validatePatientForm({
      ...validFormData,
      firstName: '',
      lastName: '',
      birthDate: '',
      sex: '',
      contactNumber: '',
      address: '',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      firstName: 'First name is required.',
      lastName: 'Last name is required.',
      birthDate: 'Birth date is required.',
      sex: 'Sex is required.',
      contactNumber: 'Contact number is required.',
      address: 'Address is required.',
    });
  });

  it('should validate email format only when email has a value', () => {
    expect(validatePatientForm({ ...validFormData, email: '' }).errors.email).toBeUndefined();

    const result = validatePatientForm({
      ...validFormData,
      email: 'invalid-email',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe('Please enter a valid email address.');
  });


  it('should reject contact numbers outside the allowed digit length', () => {
    const shortNumberResult = validatePatientForm({
      ...validFormData,
      contactNumber: '09123',
    });

    const longNumberResult = validatePatientForm({
      ...validFormData,
      contactNumber: '0912345678901234',
    });

    expect(shortNumberResult.valid).toBe(false);
    expect(shortNumberResult.errors.contactNumber).toMatch(/10.*15 digits/i);
    expect(longNumberResult.valid).toBe(false);
    expect(longNumberResult.errors.contactNumber).toMatch(/10.*15 digits/i);
  });

  it('should reject a birth date in the future', () => {
    const result = validatePatientForm({
      ...validFormData,
      birthDate: '2999-01-01',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.birthDate).toBe('Birth date cannot be in the future.');
  });

  it('should reject invalid name characters', () => {
    const result = validatePatientForm({
      ...validFormData,
      firstName: 'Juan123',
      lastName: 'Dela@Cruz',
      middleName: 'Santos!',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.firstName).toBe('First name contains invalid characters.');
    expect(result.errors.lastName).toBe('Last name contains invalid characters.');
    expect(result.errors.middleName).toBe('Middle name contains invalid characters.');
  });

  it('should allow spaces, apostrophes, and hyphens in names', () => {
    const result = validatePatientForm({
      ...validFormData,
      firstName: "Juan Carlos",
      lastName: "O'Connor-Santos",
      middleName: "De Leon",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
