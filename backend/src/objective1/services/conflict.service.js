export const hasScheduleConflict = (
    existingAppointments,
    newStart,
    newEnd
) => {

    const start = new Date(`1970-01-01T${newStart}`);
    const end = new Date(`1970-01-01T${newEnd}`);

    return existingAppointments.some((appointment) => {

        const appointmentStart = new Date(
            `1970-01-01T${appointment.start_time}`
        );

        const appointmentEnd = new Date(
            `1970-01-01T${appointment.end_time}`
        );

        return (
            start < appointmentEnd &&
            end > appointmentStart
        );

    });

};