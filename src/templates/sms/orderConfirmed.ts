/**
 * AGM Store Builder - Order Confirmed SMS Template
 */

interface OrderConfirmedSmsData {
  orderNumber: string;
  storeName: string;
  total: number;
  customerName: string;
  trackingUrl?: string;
}

export function generateOrderConfirmedSms(data: OrderConfirmedSmsData): string {
  const totalFormatted = `₦${data.total.toLocaleString()}`;
  
  if (data.trackingUrl) {
    return `Hi ${data.customerName}! Your order ${data.orderNumber} from ${data.storeName} (${totalFormatted}) is confirmed. Track: ${data.trackingUrl}`;
  }
  
  return `Hi ${data.customerName}! Your order ${data.orderNumber} from ${data.storeName} (${totalFormatted}) is confirmed and being processed. Thank you!`;
}

export function generateOrderConfirmedSmsShort(
  orderNumber: string,
  storeName: string
): string {
  return `Order ${orderNumber} confirmed! ${storeName} is preparing your order. You'll get updates soon.`;
}

export function generateOrderStatusSms(
  orderNumber: string,
  status: string,
  storeName: string
): string {
  const statusMessages = {
    confirmed: 'has been confirmed',
    processing: 'is being processed',
    fulfilled: 'has been fulfilled',
    shipped: 'has been shipped',
    delivered: 'has been delivered',
    cancelled: 'has been cancelled',
  };

  const message = statusMessages[status as keyof typeof statusMessages] || 'status updated';
  
  return `${storeName}: Your order ${orderNumber} ${message}. Check your email for details.`;
}