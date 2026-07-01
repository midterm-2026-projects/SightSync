import { describe, expect, it } from 'vitest';
import {
  createPatientProfileForm,
  mapPatientToPayload,
  mapPatientsToRows,
} from '../../utils/patientMapper';

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

  it('should map an array of patients into directory rows safely', () => {
    const patients = [
      {
        id: 1,
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        age: 26,
        sex: 'Male',
        contactNumber: '09123456789',
        status: 'Active',
      },
      null,
    ];

    expect(mapPatientsToRows(patients)).toEqual([
      expect.objectContaining({
        id: 1,
        fullName: 'Juan Dela Cruz',
        age: 26,
        sex: 'Male',
        contactNumber: '09123456789',
        status: 'Active',
      }),
      expect.objectContaining({
        id: 'unknown',
        fullName: 'Unknown Patient',
        status: 'Pending',
      }),
    ]);
  });

  it('should create profile form fields from a selected patient', () => {
    const profileData = createPatientProfileForm({
      firstName: 'Maria',
      lastName: 'Santos',
      birthDate: '1998-09-12',
      age: 27,
      sex: 'Female',
      contactNumber: '09999999999',
      email: 'maria@example.com',
      address: 'Quezon City',
      emergencyContact: 'Rico Santos',
      medicalHistory: 'Asthma',
    });

    expect(profileData).toEqual(expect.objectContaining({
      firstName: 'Maria',
      lastName: 'Santos',
      birthDate: '1998-09-12',
      email: 'maria@example.com',
      address: 'Quezon City',
    }));
  });
});
