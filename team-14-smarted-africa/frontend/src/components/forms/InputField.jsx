import React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const InputField = ({ 
  label, 
  id, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  icon: Icon,
  showPasswordToggle = false,
  showPassword,
  setShowPassword,
  onInput
}) => {
  const displayType = (type === "password" && showPassword) ? "text" : type;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          name={id}
          type={displayType}
          value={value}
          onChange={onChange}
          onInput={onInput}
          placeholder={placeholder}
          required={required}
          className={`block w-full pl-10 pr-10 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;