import db from "../../../database/db.js";

export const getAvailabilityByDoctor = async (doctorId) => {
    const result = await db.query(
        `SELECT *
         FROM doctor_availability
         WHERE doctor_id=$1
         ORDER BY available_date,start_time`,
        [doctorId]
    );
    
    return result.rows;
};

export const createAvailability = async (
    doctorId,
    availableDate,
    startTime,
    endTime,
    status
) => {

    const result = await db.query(
        `INSERT INTO doctor_availability
        (
            doctor_id,
            available_date,
            start_time,
            end_time,
            status
        )

        VALUES ($1,$2,$3,$4,$5)

        RETURNING *`,
        [
            doctorId,
            availableDate,
            startTime,
            endTime,
            status
        ]
    );

    return result.rows[0];
};

export const updateAvailability = async (
    availabilityId,
    availableDate,
    startTime,
    endTime,
    status
) => {

    const result = await db.query(
        `UPDATE doctor_availability
        SET
            available_date = $1,
            start_time = $2,
            end_time = $3,
            status = $4
        WHERE id = $5
        RETURNING *`,
        [
            availableDate,
            startTime,
            endTime,
            status,
            availabilityId
        ]
    );

    return result.rows[0];
};

export const deleteAvailability = async (availabilityId) => {
    const result = await db.query(
        "DELETE FROM doctor_availability WHERE id = $1 RETURNING *",
        [availabilityId]
    );

    return result.rows[0];
};

export const getOpenProviderAvailabilities = async () => {
    const result = await db.query(
        `SELECT *
         FROM doctor_availability
         WHERE status = 'Available'
         ORDER BY available_date, start_time`
    );
    return result.rows;
};

