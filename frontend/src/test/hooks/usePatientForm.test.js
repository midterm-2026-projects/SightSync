import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import usePatientForm from '../../hooks/usePatientForm';

const expectedInitialFormData = {
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

describe('usePatientForm hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-30T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty patient form data', () => {
    const { result } = renderHook(() => usePatientForm());

    expect(result.current.formData).toEqual(expectedInitialFormData);
  });

  it('should update a text field using handleChange', () => {
    const { result } = renderHook(() => usePatientForm());

    act(() => {
      result.current.handleChange({
        target: {
          name: 'firstName',
          value: 'Juan',
        },
      });
    });

    expect(result.current.formData.firstName).toBe('Juan');
    expect(result.current.formData.lastName).toBe('');
  });

  it('should calculate age when birthDate changes through handleChange', () => {
    const { result } = renderHook(() => usePatientForm());

    act(() => {
      result.current.handleChange({
        target: {
          name: 'birthDate',
          value: '2000-01-01',
        },
      });
    });

    expect(result.current.formData.birthDate).toBe('2000-01-01');
    expect(result.current.formData.age).toBe(26);
  });

  it('should update a field using updateField', () => {
    const { result } = renderHook(() => usePatientForm());

    act(() => {
      result.current.updateField('sex', 'Female');
    });

    expect(result.current.formData.sex).toBe('Female');
  });

  it('should calculate age when birthDate changes through updateField', () => {
    const { result } = renderHook(() => usePatientForm());

    act(() => {
      result.current.updateField('birthDate', '2026-07-01');
    });

    expect(result.current.formData.birthDate).toBe('2026-07-01');
    expect(result.current.formData.age).toBe('');
  });

  it('should reset form data back to the initial state', () => {
    const { result } = renderHook(() => usePatientForm());

    act(() => {
      result.current.updateField('firstName', 'Juan');
      result.current.updateField('contactNumber', '09123456789');
      result.current.updateField('birthDate', '2000-01-01');
    });

    expect(result.current.formData.firstName).toBe('Juan');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual(expectedInitialFormData);
  });
});
