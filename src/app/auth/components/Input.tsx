import React, { useState } from "react";
import { useField } from "formik";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Label } from "@/components/ui/label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, name, required, type, ...props }) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  // Determine input type dynamically
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-4 relative">
      <Label htmlFor={name} className="text-gray-900">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      
      <div className="relative">
        <input
          {...field}
          id={name}
          {...props}
          type={inputType}
          required={required}
          className={`w-full px-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 
                      focus:border-secondary focus:ring-2 focus:ring-secondary text-white placeholder-gray-400 
                      transition duration-200 focus:outline-none 
                      ${meta.touched && meta.error ? "border-red-500" : ""}`}
        />
        
        {/* Password Toggle Button */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
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
