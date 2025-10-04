import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import { Label } from "@/components/ui/label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, name, required, ...props }) => {
  const [field, meta] = useField(name);

  return (
    <div className="mb-4">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <input
  {...field}
  id={name}
  {...props}
  onChange={(e) => {
    field.onChange(e); // Formik state update
    if (props.onChange) props.onChange(e); // extra logic if provided
  }}
  required={required}
  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
    file:border-0 file:bg-transparent file:text-sm file:font-medium 
    placeholder:text-muted-foreground 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 
    disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-950  
    ${meta.touched && meta.error ? "border-red-500" : "border-zinc-800 mt-1"}`}
/>


      {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default Input;
