// src/components/common/Input.tsx
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
