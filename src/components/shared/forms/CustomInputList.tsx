/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useField } from "formik";

interface CustomInputListProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}

const CustomInputList: React.FC<CustomInputListProps> = ({
  label,
  name,
  required = false,
  placeholder = "Type and press Enter or click Add",
}) => {
  const [field, meta, helpers] = useField(name);
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    if (inputValue.trim()) {
      const updatedValue = [...(field.value || []), inputValue.trim()];
      helpers.setValue(updatedValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addItem();
    }
  };

  const handleRemoveItem = (item: string) => {
    const updatedValue = field.value.filter((value: string) => value !== item);
    helpers.setValue(updatedValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className={`mt-2 p-3 w-full border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none ${
            meta.touched && meta.error ? "border-red-500" : "border-gray-300"
          }`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addItem}
          className="mt-2 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
        >
          Add
        </button>
      </div>
      {meta.touched && meta.error && (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      )}
      {field.value?.length > 0 && (
        <ul className="mt-2 space-y-1">
          {field.value.map((item: string, index: number) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border rounded bg-gray-100"
            >
              <span>{item}</span>
              <button
                type="button"
                className="text-red-500"
                onClick={() => handleRemoveItem(item)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomInputList;
