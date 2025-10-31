export const validateForm = (page, formData, currentStep = 0) => {
  const newErrors = {};
  
  if (page === 'signup') {
    if (currentStep === 0) {
      if (!formData.identifier) {
        newErrors.identifier = 'Email or phone number is required';
      } else {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const emailRegex = /\S+@\S+\.\S+/;
        const cleanPhone = formData.identifier.replace(/[\s\-\(\)]/g, '');
        
        if (!phoneRegex.test(cleanPhone) && !emailRegex.test(formData.identifier)) {
          newErrors.identifier = 'Please enter a valid email or phone number';
        }
      }
    } else if (currentStep === 1) {
      if (!formData.token) {
        newErrors.token = 'Verification token is required';
      } else if (!/^\d{6}$/.test(formData.token)) {
        newErrors.token = 'Token must be 6 digits';
      }
    } else if (currentStep === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else {
        const checks = [
          /.{8,}/,
          /[a-z]/,
          /[A-Z]/,
          /[0-9]/,
          /[^A-Za-z0-9]/
        ];
        
        const failedChecks = checks.filter(check => !check.test(formData.password));
        if (failedChecks.length > 0) {
          newErrors.password = 'Password does not meet requirements';
        }
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (currentStep === 3) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must agree to the terms';
      }
    }
  } else if (page === 'login') {
    if (!formData.identifier) {
      newErrors.identifier = 'Email or phone number is required';
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const emailRegex = /\S+@\S+\.\S+/;
      const cleanPhone = formData.identifier.replace(/[\s\-\(\)]/g, '');
      
      if (!phoneRegex.test(cleanPhone) && !emailRegex.test(formData.identifier)) {
        newErrors.identifier = 'Please enter a valid email or phone number';
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
  } else if (page === 'forgot-password') {
    if (!formData.identifier) {
      newErrors.identifier = 'Email or phone number is required';
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const emailRegex = /\S+@\S+\.\S+/;
      const cleanPhone = formData.identifier.replace(/[\s\-\(\)]/g, '');
      
      if (!phoneRegex.test(cleanPhone) && !emailRegex.test(formData.identifier)) {
        newErrors.identifier = 'Please enter a valid email or phone number';
      }
    }
  } else if (page === 'reset-password') {
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const checks = [
        /.{8,}/,
        /[a-z]/,
        /[A-Z]/,
        /[0-9]/,
        /[^A-Za-z0-9]/
      ];
      
      const failedChecks = checks.filter(check => !check.test(formData.password));
      if (failedChecks.length > 0) {
        newErrors.password = 'Password does not meet requirements';
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  }
  
  return newErrors;
};