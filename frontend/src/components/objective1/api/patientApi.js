// Adjust base URL or load from env variables: import.meta.env.VITE_API_URL or process.env.REACT_APP_API_URL
const BASE_URL = "http://localhost:5000/api/patients";

/**
 * Helper to process fetch responses and standardise error handling.
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// GET /api/patients
export async function getPatients() {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
}

// GET /api/patients/:id
export async function getPatientById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(response);
}

// POST /api/patients
export async function createPatient(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include authorization headers here if needed:
      // "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });
  console.log(payload);
  return handleResponse(response);
}

// PUT /api/patients/:id
export async function updatePatient(id, payload) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

// DELETE /api/patients/:id
export async function deletePatient(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}