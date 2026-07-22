import db from "../../../database/db.js";

export const getAllAppointments = async () => {
    const result = await db.query(
        "SELECT * FROM appointments ORDER BY id ASC"
    );

    return result.rows;
};

export const getAppointmentById = async (id) => {
    const result = await db.query(
        "SELECT * FROM appointments WHERE id = $1",
        [id]
    );

    return result.rows[0];
};

export const createAppointment = async (appointment) => {

    const {
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        appointment_type,
        reason,
        status
    } = appointment;

    const result = await db.query(
        `INSERT INTO appointments
        (
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            appointment_type,
            reason,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            appointment_type,
            reason,
            status
        ]
    );

    return result.rows[0];
};

export const updateAppointment = async (id, appointment) => {

    console.log(appointment)

    const {
        patient_id,
        appointment_date,
        appointment_time,
        appointment_type,
        reason,
        status
    } = appointment;

    const result = await db.query(
        `UPDATE appointments
        SET
            patient_id = $1,
            appointment_date = $2,
            appointment_time = $3,
            appointment_type = $4,
            reason = $5,
            status = $6
        WHERE id = $7
        RETURNING *`,
        [
            patient_id,
            appointment_date,
            appointment_time,
            appointment_type,
            reason,
            status,
            id
        ]
    );

    return result.rows[0];
};

export const deleteAppointment = async (id) => {
    const result = await db.query(
        "DELETE FROM appointments WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};