import React, { TextareaHTMLAttributes } from "react";
import { useField } from "formik";
import { Label } from "@/components/ui/label";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  required?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, required, ...props }) => {
  const [field, meta] = useField(name);

  return (
    <div className="mb-4">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <textarea
        {...field}
        id={name}
        {...props}
        required={required}
        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-950 h-24 resize-none ${
          meta.touched && meta.error ? "border-red-500" : "border-zinc-800 mt-1"
        }`}
      />
      {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default Textarea;