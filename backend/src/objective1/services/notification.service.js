import { EventEmitter } from "events";

export const notificationEmitter = new EventEmitter();

export const sendAppointmentConfirmation = async (
    appointment
) => {

    try {

        const payload = {
            success: true,
            message: "Appointment confirmation sent.",
            appointmentId: appointment.id,
            patientId: appointment.patient_id,
            doctorId: appointment.doctor_id,
            date: appointment.appointment_date,
            time: appointment.appointment_time
        };

        notificationEmitter.emit("appointmentConfirmation", payload);

        return payload;

    }
    
    catch (error) {

        throw new Error(
            "Notification service failed."
        );

    }

};

export const sendNotification = async (
    callback,
    timeoutMs = 5000
) => {

    if (typeof callback !== "function") {
        return {
            success: false,
            message: "Network service unavailable."
        };
    }

    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error("Network request timed out"));
        }, timeoutMs);
    });

    try {

        const result = await Promise.race([
            callback(),
            timeoutPromise
        ]);
        clearTimeout(timeoutId);
        return result;

    }

    catch (error) {
        clearTimeout(timeoutId);
        return {

            success: false,

            message:
                "Network service unavailable."

        };

    }

};