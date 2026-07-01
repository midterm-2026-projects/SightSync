import { useState } from "react";
import usePatientForm from "../hooks/usePatientForm";
import { validatePatientForm } from "../utils/patientValidation";
import { mapPatientToPayload } from "../utils/patientMapper";

export default function PatientRegistrationForm() {
  const {
    formData,
    handleChange,
    updateField,
    resetForm,
  } = usePatientForm();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccessMessage("");

    const validation = validatePatientForm(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const payload = mapPatientToPayload(formData);

    console.log("Patient Registration Payload:");
    console.log(payload);
    

    setSuccessMessage("Patient registered successfully.");

    resetForm();
  };

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Patient Registration
        </h1>

        <p className="text-gray-500 mb-8">
          Enter the patient's information below.
        </p>

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-300 bg-green-100 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          noValidate
        >
                  {/* ============================
              Personal Information
          ============================ */}

          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-2 font-medium"
                >
                  First Name *
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
                    errors.firstName
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-2 font-medium"
                >
                  Last Name *
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Middle Name */}
              <div>
                <label
                  htmlFor="middleName"
                  className="block mb-2 font-medium"
                >
                  Middle Name
                </label>

                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
                    errors.middleName
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.middleName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.middleName}
                  </p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="block mb-2 font-medium"
                >
                  Birth Date *
                </label>

                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
                    errors.birthDate
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="age"
                  className="block mb-2 font-medium"
                >
                  Age
                </label>

                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2"
                />
              </div>

              {/* Sex */}
              <div>
                <label
                  htmlFor="sex"
                  className="block mb-2 font-medium"
                >
                  Sex *
                </label>

                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={(e) =>
                    updateField("sex", e.target.value)
                  }
                  className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
                    errors.sex
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>

                {errors.sex && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sex}
                  </p>
                )}
              </div>

            </div>
          </section>
                    {/* ============================
              Contact Information
          ============================ */}

          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className="block mb-2 font-medium"
                >
                  Contact Number *
                </label>

                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
                    errors.contactNumber
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 font-medium"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block mb-2 font-medium"
                >
                  Address *
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  placeholder="Enter complete address..."
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 outline-none resize-none transition ${
                    errors.address
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />

                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address}
                  </p>
                )}
              </div>

            </div>
          </section>
                    {/* ============================
              Emergency & Medical Information
          ============================ */}

          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Emergency & Medical Information
            </h2>

            <div className="grid grid-cols-1 gap-6">

              {/* Emergency Contact */}
              <div>
                <label
                  htmlFor="emergencyContact"
                  className="block mb-2 font-medium"
                >
                  Emergency Contact
                </label>

                <input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  placeholder="Enter emergency contact person"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500"
                />
              </div>

              {/* Medical History */}
              <div>
                <label
                  htmlFor="medicalHistory"
                  className="block mb-2 font-medium"
                >
                  Medical History
                </label>

                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  rows={5}
                  placeholder="Enter relevant medical history..."
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none resize-none transition focus:border-blue-500"
                />
              </div>

            </div>
          </section>

          {/* ============================
              Action Buttons
          ============================ */}

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">

            <button
              type="button"
              onClick={() => {
                resetForm();
                setErrors({});
                setSuccessMessage("");
              }}
              className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Register Patient
            </button>

          </div>

        </form>
      </div>
    </div>
    </>
  );
}
