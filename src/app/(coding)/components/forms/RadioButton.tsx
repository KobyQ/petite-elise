/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useField } from "formik";
import { Label } from "@/components/ui/label";

interface RadioButtonProps {
  label?: string;
  name: string;
  options: { label: string; value: boolean | string }[];
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
  const [field, meta, helpers] = useField(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const parsedValue = value === "true" ? true : value === "false" ? false : value;
    helpers.setValue(parsedValue);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="mb-4">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <div className="mt-2">
        {options.map((option) => (
          <label key={String(option.value)} className="inline-flex items-center mr-4">
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={field.value === option.value}
              className={`form-radio text-green-500 border-gray-300 checked:text-green-500 checked:border-green-500 focus:outline-none ${
                meta.touched && meta.error ? "border-red-500" : ""
              }`}
              onChange={handleChange}
            />
            <span className="ml-2 text-white">{option.label}</span>
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
