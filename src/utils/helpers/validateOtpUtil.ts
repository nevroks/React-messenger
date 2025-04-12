export const validateOtpUtil = (otp: string | undefined): boolean => {
  return otp === undefined || (otp.length === 6 && /^\d+$/.test(otp));
};
