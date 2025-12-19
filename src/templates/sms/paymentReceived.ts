/**
 * AGM Store Builder - Payment Received SMS Template
 */

interface PaymentReceivedSmsData {
  amount: number;
  reference: string;
  orderNumber?: string;
  storeName?: string;
}

export function generatePaymentReceivedSms(data: PaymentReceivedSmsData): string {
  const amountFormatted = `₦${data.amount.toLocaleString()}`;
  
  if (data.orderNumber && data.storeName) {
    return `Payment received! ${amountFormatted} for order ${data.orderNumber} at ${data.storeName}. Ref: ${data.reference}. Thank you!`;
  }
  
  return `Payment of ${amountFormatted} received successfully. Reference: ${data.reference}. Thank you for using AGM Store Builder!`;
}

export function generatePaymentReceivedSmsShort(amount: number): string {
  return `Payment of ₦${amount.toLocaleString()} received! Your order is being processed. Thank you!`;
}

export function generatePaymentFailedSms(
  orderNumber: string,
  amount: number
): string {
  return `Payment for order ${orderNumber} (₦${amount.toLocaleString()}) failed. Please try again or use a different payment method.`;
}

export function generatePayoutCompletedSms(
  amount: number,
  accountNumber: string
): string {
  const maskedAccount = accountNumber.slice(-4).padStart(accountNumber.length, '*');
  return `Payout of ₦${amount.toLocaleString()} completed to account ${maskedAccount}. Funds should reflect soon. - AGM Store Builder`;
}

export function generatePaymentReminderSms(
  orderNumber: string,
  amount: number,
  paymentUrl: string
): string {
  return `Reminder: Complete payment of ₦${amount.toLocaleString()} for order ${orderNumber}. Pay here: ${paymentUrl}`;
}