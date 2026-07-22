// patientMappers.test.js
import { describe, test, expect } from 'vitest';
import {
  mapPatientToPayload,
  mapPatientsToRows,
  createPatientProfileForm,
} from '../../../src/components/objective1/utils/patientMapper'; // Adjust path to match your utility file location

describe('Patient Mapper Utilities', () => {
  /* =========================================================================
     1. mapPatientToPayload
     ========================================================================= */
  describe('mapPatientToPayload', () => {
    test('should correctly map valid form data to API payload format and trim strings', () => {
      const formData = {
        firstName: '  John ',
        lastName: ' Doe  ',
        middleName: ' Smith ',
        birthDate: '1995-05-20',
        age: '29',
        sex: 'Male',
        status: 'Active',
        contactNumber: ' 09123456789 ',
        email: ' john@example.com ',
        address: ' 123 Main St ',
        emergencyContact: ' Jane Doe ',
        medicalHistory: ' None ',
      };

      const result = mapPatientToPayload(formData);

      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        middle_name: 'Smith',
        birth_date: '1995-05-20',
        age: 29,
        sex: 'Male',
        status: 'Active',
        contact_number: '09123456789',
        email: 'john@example.com',
        address: '123 Main St',
        emergency_contact: 'Jane Doe',
        medical_history: 'None',
      });
    });

    test('should apply default values when fields are missing or empty', () => {
      const formData = {};

      const result = mapPatientToPayload(formData);

      expect(result).toEqual({
        first_name: '',
        last_name: '',
        middle_name: '',
        birth_date: undefined,
        age: 0,
        sex: undefined,
        status: 'Active',
        contact_number: '',
        email: '',
        address: '',
        emergency_contact: '',
        medical_history: '',
      });
    });

    test('should handle non-numeric age values by falling back to 0', () => {
      const formData = { age: 'invalid_number' };
      const result = mapPatientToPayload(formData);

      expect(result.age).toBe(0);
    });
  });

  /* =========================================================================
     2. mapPatientsToRows
     ========================================================================= */
  describe('mapPatientsToRows', () => {
    test('should map an array of patients with snake_case fields correctly', () => {
      const input = [
        {
          id: 1,
          first_name: 'Jane',
          middle_name: 'A.',
          last_name: 'Doe',
          age: 30,
          sex: 'Female',
          contact_number: '09876543210',
          status: 'Active',
        },
      ];

      const result = mapPatientsToRows(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        fullName: 'Jane A. Doe',
        age: 30,
        sex: 'Female',
        contactNumber: '09876543210',
        status: 'Active',
        patient: input[0],
      });
    });

    test('should map an array of patients with camelCase fields correctly', () => {
      const input = [
        {
          _id: 'abc-123',
          firstName: 'John',
          lastName: 'Smith',
          age: 45,
          sex: 'Male',
          contactNumber: '09111111111',
        },
      ];

      const result = mapPatientsToRows(input);

      expect(result[0]).toEqual({
        id: 'abc-123',
        fullName: 'John Smith', // Missing middle name filtered out cleanly
        age: 45,
        sex: 'Male',
        contactNumber: '09111111111',
        status: 'Active',
        patient: input[0],
      });
    });

    test('should fallback to default values ("N/A") when patient fields are missing', () => {
      const input = [{}];
      const result = mapPatientsToRows(input);

      expect(result[0].fullName).toBe('N/A');
      expect(result[0].age).toBe('N/A');
      expect(result[0].sex).toBe('N/A');
      expect(result[0].contactNumber).toBe('N/A');
      expect(result[0].status).toBe('Active');
      expect(typeof result[0].id).toBe('number'); // Generated via Math.random()
    });

    test('should handle non-array input by returning an empty array', () => {
      expect(mapPatientsToRows(null)).toEqual([]);
      expect(mapPatientsToRows(undefined)).toEqual([]);
      expect(mapPatientsToRows('not an array')).toEqual([]);
    });
  });

  /* =========================================================================
     3. createPatientProfileForm
     ========================================================================= */
  describe('createPatientProfileForm', () => {
    test('should return default empty form state when patient object is null or undefined', () => {
      const expectedDefault = {
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

      expect(createPatientProfileForm(null)).toEqual(expectedDefault);
      expect(createPatientProfileForm(undefined)).toEqual(expectedDefault);
    });

    test('should map backend patient payload into form state and format birth date (YYYY-MM-DD)', () => {
      const patient = {
        first_name: 'Alice',
        last_name: 'Johnson',
        middle_name: 'M',
        birth_date: '1990-12-15T00:00:00.000Z',
        age: 33,
        sex: 'Female',
        status: 'Inactive',
        contact_number: '09129998888',
        email: 'alice@example.com',
        address: '456 Oak St',
        emergency_contact: 'Bob Johnson',
        medical_history: 'Asthma',
      };

      const result = createPatientProfileForm(patient);

      expect(result).toEqual({
        firstName: 'Alice',
        lastName: 'Johnson',
        middleName: 'M',
        birthDate: '1990-12-15',
        age: 33,
        sex: 'Female',
        status: 'Inactive',
        contactNumber: '09129998888',
        email: 'alice@example.com',
        address: '456 Oak St',
        emergencyContact: 'Bob Johnson',
        medicalHistory: 'Asthma',
      });
    });

    test('should gracefully handle invalid date strings without crashing', () => {
      const patient = { birth_date: 'invalid-date-string' };
      const result = createPatientProfileForm(patient);

      expect(result.birthDate).toBe('');
    });

    test('should preserve age 0 correctly and not convert it to empty string', () => {
      const patient = { age: 0 };
      const result = createPatientProfileForm(patient);

      expect(result.age).toBe(0);
    });
  });
});