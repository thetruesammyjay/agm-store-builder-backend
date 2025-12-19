/**
 * AGM Store Builder - OTP SMS Template
 */

interface OtpSmsData {
  code: string;
  expiryMinutes: number;
  purpose: 'signup' | 'login' | 'password_reset';
}

export function generateOtpSms(data: OtpSmsData): string {
  const purposeText = {
    signup: 'verify your account',
    login: 'sign in',
    password_reset: 'reset your password',
  }[data.purpose];

  return `Your AGM Store Builder verification code is: ${data.code}. Use this to ${purposeText}. Valid for ${data.expiryMinutes} minutes. Do not share this code.`;
}

export function generateOtpSmsShort(code: string): string {
  return `AGM Store Builder: Your verification code is ${code}. Valid for 10 minutes.`;
}