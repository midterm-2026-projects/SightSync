import db from "../../../database/db.js"

export const createDoctorModel = async (doctor) => {
    const {
        first_name,
        last_name,
        status,
        specialization,
    } = doctor;

    const result = await db.query(
        `INSERT INTO doctors (
            first_name,
            last_name,
            status,
            specialization,
        ) VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
            first_name,
            last_name,
            specialization,
            status
        ]
    );

    return result.rows[0];
}


export const updateDoctorModel = async (id, doctor) => {
    const { 
        first_name, 
        last_name, 
        status, 
        specialization,
    } = doctor;

    const result = await db.query(
        `UPDATE doctors 
         SET first_name = $1, last_name = $2, status = $3, specialization = $4
         WHERE id = $5
         RETURNING *`,
        [first_name, last_name, status, specialization, id]
    );

    return result.rows[0];
}

export const deleteDoctorModel = async (id) => {
    await db.query(`DELETE FROM doctors WHERE id = $1`, [id]);
    return { message: "Doctor deleted successfully" };
}

export const getDoctorsModel = async () => {
    const result = await db.query(`SELECT * FROM doctors`);

    console.log(result.rows)
    return result.rows;
}

export const getDoctorByIdModel = async (id) => {
    const result = await db.query(`SELECT * FROM doctors WHERE id = $1`, [id]);
    return result.rows[0];
}