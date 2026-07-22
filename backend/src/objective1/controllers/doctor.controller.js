import {
  createDoctorModel,
  updateDoctorModel,
  deleteDoctorModel,
  getDoctorsModel,
  getDoctorByIdModel,
} from "../models/doctor.model.js";

export const createDoctorController = async (req, res) => {
  try {
    const { firstName, lastName, middleName, specialization } = req.body;
    const newDoctor = await createDoctorModel(
      firstName,
      lastName,
      middleName,
      specialization
    );
    res.status(200).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDoctorController = async (req, res) => {
  try {
    const { firstName, lastName, middleName, specialization } = req.body;
    const { id } = req.params;
    const updatedDoctor = updateDoctorModel(id, firstName, lastName, middleName, specialization);
    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDoctorController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = deleteDoctorModel(id);
    res.status(200).json(deletedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDoctorsController = async (req, res) => {
  try {
    const doctors = await getDoctorsModel();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};