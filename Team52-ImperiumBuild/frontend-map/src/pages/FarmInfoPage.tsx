import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FarmInfoPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    state: "",
    fertilizerUse: "",
    pesticideUse: "",
    irrigatedArea: "",
  });

  const likertOptions = [
    { label: "None", value: 0.0 },
    { label: "Rarely", value: 0.5 },
    { label: "Sometimes", value: 1.0 },
    { label: "Often", value: 1.5 },
    { label: "Always", value: 2.0 },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const processedData = {
      ...formData,
      fertilizerUse: parseFloat(formData.fertilizerUse),
      pesticideUse: parseFloat(formData.pesticideUse),
      irrigatedArea: parseFloat(formData.irrigatedArea),
    };

    localStorage.setItem("farmInfo", JSON.stringify(processedData));
    navigate("/map");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-green-50 flex flex-col justify-center w-screen">
      <div className="bg-white shadow-xl rounded-none md:rounded-t-3xl p-8 md:p-16 border-t-8 border-green-600">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10">
          🌾 Farmer Information
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {/* First Name */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Enter first name"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Enter last name"
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* State */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Kaduna, Ogun, Kano..."
              required
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Fertilizer Use */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Fertilizer Use
            </label>
            <select
              name="fertilizerUse"
              value={formData.fertilizerUse}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select frequency</option>
              {likertOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pesticide Use */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Pesticide Use
            </label>
            <select
              name="pesticideUse"
              value={formData.pesticideUse}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select frequency</option>
              {likertOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Irrigated Area */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">
              Irrigated Area (ha)
            </label>
            <input
              type="number"
              name="irrigatedArea"
              value={formData.irrigatedArea}
              onChange={handleChange}
              placeholder="e.g. 0.5"
              min="0"
              step="0.1"
              required
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-3 flex justify-center mt-6">
            <button
              type="submit"
              className="w-full md:w-1/3 bg-green-600 text-white font-semibold rounded-lg py-3 text-lg hover:bg-green-700 transition duration-300"
            >
              Continue to Map 🗺️
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmInfoPage;
