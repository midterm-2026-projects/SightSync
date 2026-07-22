// validatePatientForm.test.js
import { describe, test, expect } from 'vitest';
import { validatePatientForm } from '../../../src/components/objective1/utils/patientValidation'; // Adjust path as needed

describe('validatePatientForm', () => {
  // Helper to create a valid baseline form object
  const createValidFormData = (overrides = {}) => ({
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Smith',
    birthDate: '1995-05-20',
    sex: 'Male',
    contactNumber: '09123456789',
    address: '123 Main St, City',
    email: 'john.doe@example.com',
    ...overrides,
  });

  /* =========================================================================
     1. Happy Path
     ========================================================================= */
  test('should pass validation with a complete and valid form', () => {
    const validData = createValidFormData();
    const result = validatePatientForm(validData);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('should pass validation when optional email is omitted', () => {
    const validData = createValidFormData({ email: '' });
    const result = validatePatientForm(validData);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  /* =========================================================================
     2. Required Fields Validation
     ========================================================================= */
  describe('Required Fields', () => {
    test('should return errors when all required fields are missing', () => {
      const emptyForm = {
        firstName: '',
        lastName: '',
        middleName: '',
        birthDate: '',
        sex: '',
        contactNumber: '',
        address: '',
        email: '',
      };

      const result = validatePatientForm(emptyForm);

      expect(result.valid).toBe(false);
      expect(result.errors.firstName).toBe('First name is required.');
      expect(result.errors.lastName).toBe('Last name is required.');
      expect(result.errors.birthDate).toBe('Birth date is required.');
      expect(result.errors.sex).toBe('Sex is required.');
      expect(result.errors.contactNumber).toBe('Contact number is required.');
      expect(result.errors.address).toBe('Address is required.');
    });

    test('should treat whitespace-only inputs as empty for required fields', () => {
      const whitespaceForm = createValidFormData({
        firstName: '   ',
        lastName: '   ',
        contactNumber: '   ',
        address: '   ',
      });

      const result = validatePatientForm(whitespaceForm);

      expect(result.valid).toBe(false);
      expect(result.errors.firstName).toBe('First name is required.');
      expect(result.errors.lastName).toBe('Last name is required.');
      expect(result.errors.contactNumber).toBe('Contact number is required.');
      expect(result.errors.address).toBe('Address is required.');
    });
  });

  /* =========================================================================
     3. Email Validation
     ========================================================================= */
  describe('Email Field', () => {
    test('should pass for valid email formats', () => {
      const validEmails = [
        'test@domain.com',
        'user.name+tag@sub.domain.org',
        'admin123@clinic.io',
      ];

      validEmails.forEach((email) => {
        const result = validatePatientForm(createValidFormData({ email }));
        expect(result.errors.email).toBeUndefined();
      });
    });
  });

  /* =========================================================================
     4. Contact Number Validation
     ========================================================================= */
  describe('Contact Number Field', () => {
    test('should pass for valid contact numbers with formatting symbols', () => {
      const validContacts = [
        '09123456789', // 11 digits
        '+639123456789', // 12 digits with plus
        '(02) 8123-4567', // 10 digits with parentheses and space
        '123-456-7890123', // 13 digits with dashes
      ];

      validContacts.forEach((contactNumber) => {
        const result = validatePatientForm(createValidFormData({ contactNumber }));
        expect(result.errors.contactNumber).toBeUndefined();
      });
    });

    test('should fail when contact number contains invalid characters', () => {
      const result = validatePatientForm(
        createValidFormData({ contactNumber: '0912345678a' })
      );

      expect(result.valid).toBe(false);
      expect(result.errors.contactNumber).toBe(
        'Contact number contains invalid characters.'
      );
    });

    test('should fail when contact number has fewer than 10 digits', () => {
      const result = validatePatientForm(
        createValidFormData({ contactNumber: '123456789' }) // 9 digits
      );

      expect(result.valid).toBe(false);
      expect(result.errors.contactNumber).toBe(
        'Contact number must contain 10–15 digits.'
      );
    });

    test('should fail when contact number has more than 15 digits', () => {
      const result = validatePatientForm(
        createValidFormData({ contactNumber: '1234567890123456' }) // 16 digits
      );

      expect(result.valid).toBe(false);
      expect(result.errors.contactNumber).toBe(
        'Contact number must contain 10–15 digits.'
      );
    });
  });

  /* =========================================================================
     5. Birth Date Validation
     ========================================================================= */
  describe('Birth Date Field', () => {
    test('should pass for past dates or today', () => {
      const pastDate = '2000-01-01';
      const today = new Date().toISOString().split('T')[0];

      expect(
        validatePatientForm(createValidFormData({ birthDate: pastDate })).errors
          .birthDate
      ).toBeUndefined();

      expect(
        validatePatientForm(createValidFormData({ birthDate: today })).errors
          .birthDate
      ).toBeUndefined();
    });

    test('should fail when birth date is set in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const result = validatePatientForm(
        createValidFormData({ birthDate: futureDateStr })
      );

      expect(result.valid).toBe(false);
      expect(result.errors.birthDate).toBe('Birth date cannot be in the future.');
    });
  });

  /* =========================================================================
     6. Name Field Validation
     ========================================================================= */
  describe('Name Fields (firstName, lastName, middleName)', () => {
    test('should allow letters, spaces, hyphens, and single quotes in names', () => {
      const validNames = createValidFormData({
        firstName: "Mary-Jane",
        lastName: "O'Connor",
        middleName: 'Anne Marie',
      });

      const result = validatePatientForm(validNames);

      expect(result.errors.firstName).toBeUndefined();
      expect(result.errors.lastName).toBeUndefined();
      expect(result.errors.middleName).toBeUndefined();
    });

    test('should fail when names contain numbers or special characters', () => {
      const invalidNames = createValidFormData({
        firstName: 'John123',
        lastName: 'Doe!',
        middleName: 'Smith@',
      });

      const result = validatePatientForm(invalidNames);

      expect(result.valid).toBe(false);
      expect(result.errors.firstName).toBe(
        'First name contains invalid characters.'
      );
      expect(result.errors.lastName).toBe(
        'Last name contains invalid characters.'
      );
      expect(result.errors.middleName).toBe(
        'Middle name contains invalid characters.'
      );
    });
  });
});