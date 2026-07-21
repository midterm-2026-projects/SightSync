// Base URL for Express server. Adjust port or route path as necessary.
const API_BASE_URL = 'http://localhost:5000/api/appointments';

// Helper function to process response and handle HTTP errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }
  return response.json();
};

/**
 * GET /
 * Fetches all appointments
 */
export const getAllAppointments = async () => {
  const res = await fetch(API_BASE_URL);
  return handleResponse(res);
};

/**
 * GET /:id
 * Fetches a single appointment by ID
 */
export const getAppointmentById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  return handleResponse(res);
};

/**
 * POST /
 * Creates a new appointment
 * @param {Object} appointmentData - Includes patient_id, doctor_id, appointment_date, appointment_time, appointment_type, reason, status
 */
export const createAppointment = async (appointmentData) => {
  console.log(appointmentData);
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData),
  });
  console.log(res);
  return handleResponse(res);
};

/**
 * PUT /:id
 * Updates an existing appointment
 * @param {number|string} id - Appointment ID
 * @param {Object} appointmentData - Data to update
 */
export const updateAppointment = async (id, appointmentData) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData),
  });
  return handleResponse(res);
};

/**
 * DELETE /:id
 * Deletes an appointment by ID
 */
export const deleteAppointment = async (id) => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};