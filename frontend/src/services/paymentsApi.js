const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to handle fetch responses and throw structured errors
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Create a pending payment record
 * @param {Object} paymentData - { patient_name, doctor_name, amount, method }
 * @returns {Promise<Object>} Created payment object with generated ID
 */
export async function createPayment(paymentData) {
  const response = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  
  return handleResponse(response);
}

/**
 * Confirm a pending payment by its ID
 * @param {string|number} paymentId 
 * @returns {Promise<Object>} Object containing the payment status and baseline receipt data
 */
export async function confirmPayment(paymentId) {
  const response = await fetch(`${BASE_URL}/payments/${paymentId}/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
}