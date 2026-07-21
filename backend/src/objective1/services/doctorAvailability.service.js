import {
  getAvailabilityByDoctor,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getOpenProviderAvailabilities,
} from "../models/doctorAvailability.model.js";

export class DoctorAvailabilityCalculator {
  // recognizes and returns scheduling collisions for a doctor's timestamp range
  static checkCollisions(existingSlots, newStart, newEnd) {
    const start = new Date(`1970-01-01T${newStart}`);
    const end = new Date(`1970-01-01T${newEnd}`);

    return existingSlots.filter((slot) => {
      const slotStart = new Date(`1970-01-01T${slot.start_time}`);
      const slotEnd = new Date(`1970-01-01T${slot.end_time}`);
      return start < slotEnd && end > slotStart;
    });
  }

  // tracks active assignment metrics across provider calendars
  static calculateMetrics(slots) {
    const total = slots.length;
    const booked = slots.filter((s) => s.status === "Booked").length;
    const available = slots.filter((s) => s.status === "Available").length;
    const utilizationRate = total > 0 ? (booked / total) * 100 : 0;
    return {
      totalSlots: total,
      bookedSlots: booked,
      availableSlots: available,
      utilizationRate: parseFloat(utilizationRate.toFixed(2)),
    };
  }
}

export const getDoctorAvailability = async (doctorId) => {
  if (!doctorId || doctorId <= 0) {
    throw new Error("Doctor ID is required.");
  }

  return await getAvailabilityByDoctor(doctorId);
};

export const createDoctorAvailability = async (
  doctorId,
  availableDate,
  startTime,
  endTime,
  status
) => {
  if (!doctorId || !availableDate || !startTime || !endTime || !status) {
    throw new Error("All fields are required.");
  }

  return await createAvailability(
    doctorId,
    availableDate,
    startTime,
    endTime,
    status
  );
};

export const updateDoctorAvailability = async (
  availabilityId,
  availableDate,
  startTime,
  endTime,
  status
) => {
  if (
    !availabilityId ||
    !availableDate ||
    !startTime ||
    !endTime ||
    !status
  ) {
    throw new Error("All fields are required.");
  }

  return await updateAvailability(
    availabilityId,
    availableDate,
    startTime,
    endTime,
    status
  );
};

export const deleteDoctorAvailability = async (availabilityId) => {
  if (!availabilityId || availabilityId <= 0) {
    throw new Error("Availability ID is required.");
  }

  return await deleteAvailability(availabilityId);
};

export const getOpenProviderAvailability = async () => {
  return await getOpenProviderAvailabilities();
};

export const getProviderMetrics = async (doctorId) => {
  const slots = await getDoctorAvailability(doctorId);
  return DoctorAvailabilityCalculator.calculateMetrics(slots);
};

export const getCollisions = async (doctorId, startTime, endTime) => {
  const slots = await getDoctorAvailability(doctorId);
  return DoctorAvailabilityCalculator.checkCollisions(slots, startTime, endTime);
};

