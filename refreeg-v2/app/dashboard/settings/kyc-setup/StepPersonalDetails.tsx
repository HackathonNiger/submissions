import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { getDays, getMonths, getYears } from "@/app/utils/dobUtils";

export const inputBoxClass =
  "w-[530px] h-20 px-2.5 pt-[6px] text-neutral-700 text-sm font-normal font-montserrat rounded-[10px] outline outline-1 outline-neutral-200 resize-none";

export default function StepPersonalDetails({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  const [touched, setTouched] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const updateField = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    setTouched({ ...touched, [key]: true });
    validateField(key, value);
  };

  const validateField = (key: string, value: string) => {
    let error = "";
    if (!value) {
      error = "This field is required.";
    } else if (
      key === "phone" &&
      !/^\+?\d{7,15}$/.test(value.replace(/\s/g, ""))
    ) {
      error = "Enter a valid phone number.";
    }
    setErrors((prev: any) => ({ ...prev, [key]: error }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {/* First Name */}
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="firstName" className="font-montserrat">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="e.g. John"
            value={formData.firstName || ""}
            onChange={(e) => updateField("firstName", e.target.value)}
            onBlur={() => validateField("firstName", formData.firstName)}
            className="w-full"
          />
          {touched.firstName && errors.firstName && (
            <span className="text-red-600 text-xs font-montserrat">
              {errors.firstName}
            </span>
          )}
        </div>
        {/* Last Name */}
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="lastName" className="font-montserrat">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="e.g. Doe"
            value={formData.lastName || ""}
            onChange={(e) => updateField("lastName", e.target.value)}
            onBlur={() => validateField("lastName", formData.lastName)}
            className="w-full"
          />
          {touched.lastName && errors.lastName && (
            <span className="text-red-600 text-xs font-montserrat">
              {errors.lastName}
            </span>
          )}
        </div>
      </div>
      {/* Phone Number & DOB */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="phone" className="font-montserrat">
            Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="e.g. +2348012345678"
            value={formData.phone || ""}
            onChange={(e) => {
              // Only allow numbers, +, and spaces
              const val = e.target.value.replace(/[^\d+]/g, "");
              updateField("phone", val);
            }}
            onBlur={() => validateField("phone", formData.phone)}
            className="w-full"
            inputMode="numeric"
            pattern="[0-9+]*"
          />
          {touched.phone && errors.phone && (
            <span className="text-red-600 text-xs font-montserrat">
              {errors.phone}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-1 w-full">
          <Label className="font-montserrat">Date of Birth</Label>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {/* Day */}
            <select
              value={formData.dobDay || ""}
              onChange={(e) => updateField("dobDay", e.target.value)}
              onBlur={() => validateField("dobDay", formData.dobDay)}
              className="w-full sm:flex-1 h-12 rounded-xl border px-2 bg-gray-100"
            >
              <option value="">Day</option>
              {getDays().map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            {/* Month */}
            <select
              value={formData.dobMonth || ""}
              onChange={(e) => updateField("dobMonth", e.target.value)}
              onBlur={() => validateField("dobMonth", formData.dobMonth)}
              className="w-full sm:flex-1 h-12 rounded-xl border px-2 bg-gray-100"
            >
              <option value="">Month</option>
              {getMonths().map((month, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {month}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              value={formData.dobYear || ""}
              onChange={(e) => updateField("dobYear", e.target.value)}
              onBlur={() => validateField("dobYear", formData.dobYear)}
              className="w-full sm:flex-1 h-12 rounded-xl border px-2 bg-gray-100"
            >
              <option value="">Year</option>
              {getYears().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-1">
            {touched.dobDay && errors.dobDay && (
              <span className="text-red-600 text-xs font-montserrat flex-1">
                {errors.dobDay}
              </span>
            )}
            {touched.dobMonth && errors.dobMonth && (
              <span className="text-red-600 text-xs font-montserrat flex-1">
                {errors.dobMonth}
              </span>
            )}
            {touched.dobYear && errors.dobYear && (
              <span className="text-red-600 text-xs font-montserrat flex-1">
                {errors.dobYear}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
