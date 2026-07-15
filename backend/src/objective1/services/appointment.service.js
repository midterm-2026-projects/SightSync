import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../models/appointment.model.js";

import { getPatientById } from "../models/patient.model.js";
// import { getDoctorAvailability, createDoctorAvailability } from "./doctorAvailability.service.js";
import { hasScheduleConflict } from "./conflict.service.js";

// export const converted_time = async (appointment) => {
//   const {
//     patient_id,
//     doctor_id,
//     appointment_date,
//     appointment_time,
//     appointment_type,
//     status,
//   } = appointment;

//   const [hour, minute] = appointment_time.split(":").map(Number);

//   const end = new Date();
//   end.setHours(hour, minute + 30, 0);

//   const endTime = end.toTimeString().slice(0, 8);

//   return await createDoctorAvailability(
//     doctor_id,
//     appointment_date,
//     appointment_time,
//     endTime,
//     "Booked",
//   );
// };

const VALID_APPOINTMENT_TYPES = ["Consultation", "Follow-up"];

const VALID_STATUSES = ["Scheduled", "Completed", "Cancelled", "No Show"];

// ===========================
// GET ALL
// ===========================
export const getAllAppointmentsService = async () => {
  return await getAllAppointments();
};

// ===========================
// GET BY ID
// ===========================
export const getAppointmentByIdService = async (id) => {
  if (!id || id <= 0) {
    throw new Error("Invalid appointment ID.");
  }

  const appointment = await getAppointmentById(id);

  if (!appointment) {
    throw new Error("Appointment not found.");
  }

  return appointment;
};

// ===========================
// CREATE
// ===========================
export const createAppointmentService = async (appointment) => {
  const {
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    appointment_type,
    status,
  } = appointment;

  // Patient must exist
  const patient = await getPatientById(patient_id);

  if (!patient) {
    throw new Error("Patient not found.");
  }

  if (!doctor_id || doctor_id <= 0) {
    throw new Error("Doctor ID is required.");
  }

  // Appointment type validation
  if (!VALID_APPOINTMENT_TYPES.includes(appointment_type)) {
    throw new Error("Invalid appointment type.");
  }

  // Status validation
  if (status && !VALID_STATUSES.includes(status)) {
    throw new Error("Invalid appointment status.");
  }

  // Cannot schedule in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointmentDate = new Date(appointment_date);

  if (appointmentDate < today) {
    throw new Error("Appointment date cannot be in the past.");
  }

  // Default status
  appointment.status = status || "Scheduled";
//   const [hour, minute] = appointment_time.split(":").map(Number);

//   const end = new Date();
//   end.setHours(hour, minute + 30, 0);

//   const endTime = end.toTimeString().slice(0, 8);

//   // Get the doctor's existing booked slots
//   const existingAppointments = await getDoctorAvailability(doctor_id);

//   // Check if the requested time overlaps
//   const hasConflict = hasScheduleConflict(
//     existingAppointments,
//     appointment_time,
//     endTime,
//   );

//   if (hasConflict) {
//     throw new Error("Doctor already has an appointment during this time.");
//   }
//   await converted_time(appointment);
  return await createAppointment(appointment);
};

// ===========================
// UPDATE
// ===========================
export const updateAppointmentService = async (id, appointment) => {
  if (!id || id <= 0) {
    throw new Error("Invalid appointment ID.");
  }

  const existingAppointment = await getAppointmentById(id);

  if (!existingAppointment) {
    throw new Error("Appointment not found.");
  }

  const patient = await getPatientById(appointment.patient_id);

  if (!patient) {
    throw new Error("Patient not found.");
  }

  if (!VALID_APPOINTMENT_TYPES.includes(appointment.appointment_type)) {
    throw new Error("Invalid appointment type.");
  }

  if (!VALID_STATUSES.includes(appointment.status)) {
    throw new Error("Invalid appointment status.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointmentDate = new Date(appointment.appointment_date);

  if (appointmentDate < today) {
    throw new Error("Appointment date cannot be in the past.");
  }

  return await updateAppointment(id, appointment);
};

// ===========================
// DELETE
// ===========================
export const deleteAppointmentService = async (id) => {
  if (!id || id <= 0) {
    throw new Error("Invalid appointment ID.");
  }

  const appointment = await getAppointmentById(id);

  if (!appointment) {
    throw new Error("Appointment not found.");
  }

  return await deleteAppointment(id);
};
