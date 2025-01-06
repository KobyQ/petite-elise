/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Select, { Props as SelectProps } from "react-select";
import { useField } from "formik";

interface CustomSelectProps extends Omit<SelectProps, "onChange" | "value" | "isMulti"> {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  required?: boolean;
  isMulti?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, name, options, required, isMulti = false, ...props }) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (selectedOptions: any) => {
    if (isMulti) {
      helpers.setValue(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
    } else {
      helpers.setValue(selectedOptions ? selectedOptions.value : "");
    }
  };

  const getValue = () => {
    if (isMulti) {
      return options.filter((option) => field.value?.includes(option.value));
    } else {
      return options.find((option) => option.value === field.value) || null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <Select
        className={`mt-2 ${meta.touched && meta.error ? "border-red-500" : ""}`}
        options={options}
        value={getValue()}
        onChange={handleChange}
        isMulti={isMulti}
        classNamePrefix="react-select"
        {...props}
      />
 
         {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default CustomSelect;
