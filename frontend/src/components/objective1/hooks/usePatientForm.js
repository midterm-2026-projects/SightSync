import { useState } from "react";

const initialFormData = {
  firstName: "",
  lastName: "",
  middleName: "",
  birthDate: "",
  age: "",
  sex: "",
  contactNumber: "",
  email: "",
  address: "",
  emergencyContact: "",
  medicalHistory: "",
};

export default function usePatientForm() {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Automatically calculate age when birth date changes
      if (name === "birthDate") {
        updated.age = calculateAge(value);
      }

      return updated;
    });
  };

  const updateField = (name, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "birthDate") {
        updated.age = calculateAge(value);
      }

      return updated;
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    setFormData,
    handleChange,
    updateField,
    resetForm,
  };
}

function calculateAge(birthDate) {
  if (!birthDate) return "";

  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : "";
}