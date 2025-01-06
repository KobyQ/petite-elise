import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, name, required, ...props }) => {
  const [field, meta] = useField(name);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        {...field} 
        id={name}
        {...props} 
        required={required}
        className={`mt-2 p-3 w-full border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none ${
          meta.touched && meta.error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default Input;
