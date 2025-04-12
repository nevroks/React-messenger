export const validatePhoneNumber = (phone: string) => {
    const internationalPattern = /^\+?[1-9]\d{1,14}$/; 
    const russianPattern = /^\+7\d{10}$/;
    
    if (!phone) {
      return 'Phone number is required';
    }
  
    if (!internationalPattern.test(phone)) {
      return 'Phone number must follow the international format, e.g. +1234567890';
    }
  
    if (phone.startsWith('+7') && !russianPattern.test(phone)) {
      return 'Invalid Russian phone number format. It must start with +7 followed by 10 digits';
    }
  
    if (phone.length < 10 || phone.length > 15) {
      return 'Phone number must be between 10 and 15 digits';
    }
  
    return null; 
  };
  