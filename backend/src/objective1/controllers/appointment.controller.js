
import 
    { 
        getAllAppointmentsService, 
        getAppointmentByIdService, 
        createAppointmentService, 
        updateAppointmentService, 
        deleteAppointmentService
    } from "../services/appointment.service.js";


export const getAllAppointmentController = async (req, res) => {
    try {
        const appointments = await getAllAppointmentsService();
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAppointmentByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await getAppointmentByIdService(id);
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createAppointmentController = async (req, res) => {
    try {
        const appointment = await createAppointmentService(req.body);
        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateAppointmentController = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await updateAppointmentService(id, req.body);
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteAppointmentController = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await deleteAppointmentService(id);
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

