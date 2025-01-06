/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useField } from "formik";

interface RadioButtonProps {
  label: string;
  name: string;
  options: { label: string; value: boolean }[]; // Ensure values are boolean
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  name,
  options,
  required,
  onChange,
}) => {
  const [field, meta, helpers] = useField(name); // Access Formik helpers for explicit updates

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "true"; // Convert string to boolean
    helpers.setValue(value); // Set the value explicitly in Formik
    if (onChange) {
      onChange(event); // Call the additional onChange handler
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="mt-2">
        {options.map((option) => (
          <label key={String(option.value)} className="inline-flex items-center mr-4">
            <input
              type="radio"
              name={name}
              value={String(option.value)} // Ensure value is a string for the input
              checked={field.value === option.value} // Compare explicitly with boolean
              className={`form-radio text-green-400 border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                meta.touched && meta.error ? "border-red-500" : ""
              }`}
              onChange={handleChange}
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default RadioButton;
