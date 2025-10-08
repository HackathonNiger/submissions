import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrength = ({ password }) => {
  const checks = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[a-z]/, label: "Lowercase letter" },
    { regex: /[A-Z]/, label: "Uppercase letter" },
    { regex: /[0-9]/, label: "Number" },
    { regex: /[^A-Za-z0-9]/, label: "Special character (!@#$%^&*)" }
  ];

  const passedChecks = checks.filter(check => check.regex.test(password));
  const strength = passedChecks.length;
  
  let strengthText = "";
  let strengthColor = "";
  
  if (strength === 0) {
    strengthText = "";
    strengthColor = "";
  } else if (strength < 3) {
    strengthText = "Weak";
    strengthColor = "text-red-500";
  } else if (strength < 5) {
    strengthText = "Medium";
    strengthColor = "text-yellow-500";
  } else {
    strengthText = "Strong";
    strengthColor = "text-green-500";
  }

  return (
    <div className="mt-2">
      {password && (
        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span>Password strength:</span>
            <span className={`font-medium ${strengthColor}`}>{strengthText}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                strength === 0 ? 'w-0' :
                strength < 3 ? 'w-1/3 bg-red-500' :
                strength < 5 ? 'w-2/3 bg-yellow-500' :
                'w-full bg-green-500'
              }`}
            />
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        {checks.map((check, index) => {
          const passed = check.regex.test(password);
          return (
            <div key={index} className="flex items-center text-sm">
              {passed ? (
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              )}
              <span className={passed ? "text-green-600 line-through" : "text-gray-600"}>
                {check.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;