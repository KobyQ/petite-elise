import React, { useState, InputHTMLAttributes } from "react";
import { useField } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, name, required, type, ...props }) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  return (
    <div className="mb-4 relative">
      <label htmlFor={name} className="block text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <input
          {...field}
          id={name}
          type={isPasswordField && showPassword ? "text" : type}
          {...props}
          required={required}
          className={`mt-2 p-3 w-full border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none ${
            meta.touched && meta.error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>
      {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default Input;
