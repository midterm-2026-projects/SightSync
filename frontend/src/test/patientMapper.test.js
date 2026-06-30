import { describe, expect, it } from 'vitest';
import { mapPatientToPayload } from '../utils/patientMapper';

describe('mapPatientToPayload', () => {
  it('should map patient form data into the backend payload structure', () => {
    const formData = {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      middleName: 'Santos',
      birthDate: '2000-01-01',
      age: '26',
      sex: 'Male',
      contactNumber: '09123456789',
      email: 'juan@example.com',
      address: 'Manila City',
      emergencyContact: 'Maria Dela Cruz',
      medicalHistory: 'None',
    };

    expect(mapPatientToPayload(formData)).toEqual({
      first_name: 'Juan',
      last_name: 'Dela Cruz',
      middle_name: 'Santos',
      birth_date: '2000-01-01',
      age: 26,
      sex: 'Male',
      contact_number: '09123456789',
      email: 'juan@example.com',
      address: 'Manila City',
      emergency_contact: 'Maria Dela Cruz',
      medical_history: 'None',
    });
  });

  it('should trim text values before mapping them', () => {
    const formData = {
      firstName: '  Juan  ',
      lastName: '  Dela Cruz  ',
      middleName: '  Santos  ',
      birthDate: '2000-01-01',
      age: '26',
      sex: 'Male',
      contactNumber: '  09123456789  ',
      email: '  juan@example.com  ',
      address: '  Manila City  ',
      emergencyContact: '  Maria Dela Cruz  ',
      medicalHistory: '  None  ',
    };

    expect(mapPatientToPayload(formData)).toEqual(
      expect.objectContaining({
        first_name: 'Juan',
        last_name: 'Dela Cruz',
        middle_name: 'Santos',
        contact_number: '09123456789',
        email: 'juan@example.com',
        address: 'Manila City',
        emergency_contact: 'Maria Dela Cruz',
        medical_history: 'None',
      })
    );
  });

  it('should default age to 0 when age is empty or not numeric', () => {
    const baseFormData = {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      middleName: '',
      birthDate: '2000-01-01',
      age: '',
      sex: 'Male',
      contactNumber: '09123456789',
      email: '',
      address: 'Manila City',
      emergencyContact: '',
      medicalHistory: '',
    };

    expect(mapPatientToPayload(baseFormData).age).toBe(0);
    expect(mapPatientToPayload({ ...baseFormData, age: 'abc' }).age).toBe(0);
  });
});
