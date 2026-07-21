import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PatientRegistrationForm from "../../components/objective1/Registration/PatientRegistrationForm";

// 1. Mock dependencies
import usePatientForm from "../../components/objective1/hooks/usePatientForm";
import { validatePatientForm } from "../../components/objective1/utils/patientValidation";
import { mapPatientToPayload } from "../../components/objective1/utils/patientMapper";
import { createPatient } from "../../components/objective1/api/patientApi";

vi.mock("../../components/objective1/hooks/usePatientForm");
vi.mock("../../components/objective1/utils/patientValidation");
vi.mock("../../components/objective1/utils/patientMapper");
vi.mock("../../components/objective1/api/patientApi");

describe("PatientRegistrationForm", () => {
  const mockHandleChange = vi.fn();
  const mockUpdateField = vi.fn();
  const mockResetForm = vi.fn();

  const mockFormData = {
    firstName: "John",
    lastName: "Doe",
    middleName: "",
    birthDate: "1990-01-01",
    age: 34,
    sex: "Male",
    status: "Active",
    contactNumber: "09123456789",
    email: "john@example.com",
    address: "123 Main St",
    emergencyContact: "Jane Doe",
    medicalHistory: "None",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default hook return value
    usePatientForm.mockReturnValue({
      formData: mockFormData,
      handleChange: mockHandleChange,
      updateField: mockUpdateField,
      resetForm: mockResetForm,
    });

    // Default validation passes
    validatePatientForm.mockReturnValue({ valid: true, errors: {} });
    mapPatientToPayload.mockReturnValue({ payload: "mapped_data" });
    createPatient.mockResolvedValue({ id: 1 });
  });

  it("renders form headings and input fields correctly", () => {
    render(<PatientRegistrationForm />);

    expect(screen.getByRole("heading", { name: /patient registration/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sex \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact number \*/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register patient/i })).toBeInTheDocument();
  });

  it("triggers handleChange and updateField on user input", async () => {
    const user = userEvent.setup();
    render(<PatientRegistrationForm />);

    const firstNameInput = screen.getByLabelText(/first name \*/i);
    await user.type(firstNameInput, "Jane");
    expect(mockHandleChange).toHaveBeenCalled();

    const sexSelect = screen.getByLabelText(/sex \*/i);
    await user.selectOptions(sexSelect, "Female");
    expect(mockUpdateField).toHaveBeenCalledWith("sex", "Female");
  });

  it("shows validation errors and halts submission when form is invalid", async () => {
    const user = userEvent.setup();
    
    // Mock validation failure
    validatePatientForm.mockReturnValue({
      valid: false,
      errors: {
        firstName: "First name is required.",
        contactNumber: "Invalid contact number format.",
      },
    });

    render(<PatientRegistrationForm />);

    await user.click(screen.getByRole("button", { name: /register patient/i }));

    expect(validatePatientForm).toHaveBeenCalledWith(mockFormData);
    expect(screen.getByText("First name is required.")).toBeInTheDocument();
    expect(screen.getByText("Invalid contact number format.")).toBeInTheDocument();
    expect(createPatient).not.toHaveBeenCalled();
  });

  it("submits the form successfully and displays success message", async () => {
    const user = userEvent.setup();
    render(<PatientRegistrationForm />);

    await user.click(screen.getByRole("button", { name: /register patient/i }));

    expect(validatePatientForm).toHaveBeenCalledWith(mockFormData);
    expect(mapPatientToPayload).toHaveBeenCalledWith(mockFormData);
    expect(createPatient).toHaveBeenCalledWith({ payload: "mapped_data" });

    await waitFor(() => {
      expect(screen.getByText("Patient registered successfully.")).toBeInTheDocument();
    });

    expect(mockResetForm).toHaveBeenCalled();
  });

  it("handles API errors gracefully and displays error message", async () => {
    const user = userEvent.setup();
    
    // Mock API failure
    createPatient.mockRejectedValueOnce(new Error("Network error"));

    render(<PatientRegistrationForm />);

    await user.click(screen.getByRole("button", { name: /register patient/i }));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    expect(mockResetForm).not.toHaveBeenCalled();
  });

  it("resets form state when Reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<PatientRegistrationForm />);

    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(mockResetForm).toHaveBeenCalled();
  });
});