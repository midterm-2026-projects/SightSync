export const sendAppointmentConfirmation = async (
    appointment
) => {

    try {

        return {

            success: true,

            message:
                "Appointment confirmation sent.",

            appointmentId:
                appointment.id,

            patientId:
                appointment.patient_id

        };

    }
    
    catch (error) {

        throw new Error(
            "Notification service failed."
        );

    }

};

export const sendNotification = async (
    callback
) => {

    try {

        return await callback();

    }

    catch {

        return {

            success: false,

            message:
                "Network service unavailable."

        };

    }

};