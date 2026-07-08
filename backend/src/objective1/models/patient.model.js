import db from "../../../database/db.js";

export const getAllPatients = async () => {
    const result = await db.query(
        "SELECT * FROM patients ORDER BY id ASC"
    );

    return result.rows;
};

export const getPatientById = async (id) => {
    const result = await db.query(
        "SELECT * FROM patients WHERE id = $1",
        [id]
    );

    return result.rows[0];
};

export const createPatient = async (patient) => {

    const {
        first_name,
        last_name,
        middle_name,
        birth_date,
        age,
        sex,
        contact_number,
        email,
        address,
        emergency_contact,
        medical_history,
        status
    } = patient;

    const result = await db.query(
        `
        INSERT INTO patients (
            first_name,
            last_name,
            middle_name,
            birth_date,
            age,
            sex,
            contact_number,
            email,
            address,
            emergency_contact,
            medical_history,
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *;
        `,
        [
            first_name,
            last_name,
            middle_name,
            birth_date,
            age,
            sex,
            contact_number,
            email,
            address,
            emergency_contact,
            medical_history,
            status
        ]
    );

    return result.rows[0];
};