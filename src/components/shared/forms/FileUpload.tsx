import { FileOrUrl } from "@/utils/interfaces";
import React, { useState, useRef, useEffect } from "react";
import { useField } from "formik";

interface FileUploadProps {
  label: string;
  name: string;
  required?: boolean;
  initialValue?: FileOrUrl; // Optional prop for initial file URL
  maxSizeMB?: number; // Maximum file size in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  required = false,
  initialValue = "",
  maxSizeMB = 5, // Default max file size is 5MB
}) => {
  const [fileUrl, setFileUrl] = useState<FileOrUrl>(initialValue);
  const [file, setFile] = useState<File | null>(null);
  const [originalValueIsString, setOriginalValueIsString] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    if (typeof initialValue === "string" && initialValue !== "") {
      setOriginalValueIsString(true);
      setFileUrl(initialValue);
    }
  }, [initialValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles[0]) {
      const selectedFile = selectedFiles[0];

      // Check file size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        helpers.setError(`File size exceeds ${maxSizeMB}MB.`);
        return;
      }

      setFile(selectedFile);
      setFileUrl("");
      helpers.setValue(selectedFile);
      helpers.setError(undefined); // Clear any existing errors
    }
  };

  const handleReplaceFile = () => {
    setFile(null);
    setFileUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    if (originalValueIsString) {
      setFile(null);
      setFileUrl(initialValue as string);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      helpers.setValue(initialValue);
      helpers.setError(undefined);
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {/* Display File Input */}
      {typeof fileUrl === "string" && fileUrl && !file ? (
        <div className="flex flex-col space-y-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition text-center"
          >
            View Uploaded File
          </a>
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition"
            onClick={handleReplaceFile}
          >
            Replace File
          </button>
          <input
            type="file"
            id={name}
            name={name}
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            id={name}
            name={name}
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            className={`w-full flex justify-between items-center px-4 py-2 border rounded shadow text-gray-700 transition ${
              meta.error
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <span>Select File</span>
            <span className="text-sm text-gray-500">
              {file ? file.name : "No file selected"}
            </span>
          </button>
          {originalValueIsString && file && (
            <button
              type="button"
              className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
              onClick={handleReset}
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      <p className="mt-2 text-sm text-gray-500">
        Maximum file size: {maxSizeMB}MB.
      </p>

      {/* Error Message */}
      {meta.error && (
        <p className="mt-1 text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default FileUpload;
