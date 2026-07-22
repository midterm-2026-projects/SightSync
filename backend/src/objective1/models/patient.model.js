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

export const updatePatient = async (id, patientInfo) => {
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
    } = patientInfo;

    const result = await db.query(
        `
        UPDATE patients
        SET
            first_name = $1,
            last_name = $2,
            middle_name = $3,
            birth_date = $4,
            age = $5,
            sex = $6,
            contact_number = $7,
            email = $8,
            address = $9,
            emergency_contact = $10,
            medical_history = $11,
            status = $12
        WHERE id = $13
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
            status,
            id
        ]
    );

    return result.rows[0];
};

export const deletePatient = async (id) => {
    const result = await db.query(
        "DELETE FROM patients WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};
