/**
 * AGM Store Builder - Monnify API Types
 * Types specific to Monnify payment gateway integration
 */

/**
 * Monnify Payment Initialization Request
 */
export interface MonnifyInitializePaymentRequest {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentReference: string;
  paymentDescription: string;
  currencyCode: string;
  contractCode: string;
  redirectUrl: string;
  paymentMethods: string[];
  metadata?: Record<string, any>;
}

/**
 * Monnify Payment Initialization Response
 */
export interface MonnifyInitializePaymentResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    transactionReference: string;
    paymentReference: string;
    merchantName: string;
    apiKey: string;
    enabledPaymentMethod: string[];
    checkoutUrl: string;
  };
}

/**
 * Monnify Transaction Status
 */
export type MonnifyTransactionStatus = 
  | 'PAID' 
  | 'PENDING' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'EXPIRED' 
  | 'REVERSED';

/**
 * Monnify Payment Verification Response
 */
export interface MonnifyVerificationResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    transactionReference: string;
    paymentReference: string;
    amountPaid: string | number;
    totalPayable: string | number;
    settlementAmount: string | number;
    paidOn: string;
    paymentStatus: MonnifyTransactionStatus;
    paymentDescription: string;
    currency: string;
    paymentMethod: string;
    product: {
      type: string;
      reference: string;
    };
    cardDetails?: {
      cardType: string;
      last4: string;
      bin: string;
      bankCode: string;
      bankName: string;
      reusable: boolean;
    };
    accountDetails?: {
      accountName: string;
      accountNumber: string;
      bankCode: string;
      bankName: string;
    };
    accountPayments: Array<{
      accountNumber: string;
      bankCode: string;
      bankName: string;
      amountPaid: string | number;
      accountName: string;
    }>;
    customer: {
      email: string;
      name: string;
      phoneNumber?: string;
    };
    metaData?: Record<string, any>;
  };
}

/**
 * Monnify Webhook Payload
 */
export interface MonnifyWebhookPayload {
  transactionReference: string;
  paymentReference: string;
  amountPaid: string;
  totalPayable: string;
  settlementAmount: string;
  paidOn: string;
  paymentStatus: MonnifyTransactionStatus;
  paymentDescription: string;
  transactionHash: string;
  currency: string;
  paymentMethod: string;
  product: {
    type: string;
    reference: string;
  };
  cardDetails?: {
    cardType: string;
    last4: string;
    bin: string;
  };
  accountDetails?: {
    accountName: string;
    accountNumber: string;
    bankCode: string;
    bankName: string;
  };
  customer: {
    email: string;
    name: string;
  };
  metaData?: Record<string, any>;
}

/**
 * Monnify Auth Response
 */
export interface MonnifyAuthResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    accessToken: string;
    expiresIn: number;
  };
}

/**
 * Monnify Bank List Response
 */
export interface MonnifyBankListResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: Array<{
    name: string;
    code: string;
    ussdTemplate?: string;
    baseUssdCode?: string;
    transferUssdTemplate?: string;
  }>;
}

/**
 * Monnify Account Verification Request
 */
export interface MonnifyAccountVerificationRequest {
  accountNumber: string;
  bankCode: string;
}

/**
 * Monnify Account Verification Response
 */
export interface MonnifyAccountVerificationResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
  };
}

/**
 * Monnify Disbursement Request
 */
export interface MonnifyDisbursementRequest {
  amount: number;
  reference: string;
  narration: string;
  destinationBankCode: string;
  destinationAccountNumber: string;
  currency: string;
  sourceAccountNumber: string;
  destinationAccountName?: string;
}

/**
 * Monnify Disbursement Response
 */
export interface MonnifyDisbursementResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    reference: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    amount: number;
    dateCreated: string;
    totalFee: number;
    destinationAccountNumber: string;
    destinationAccountName: string;
    destinationBankName: string;
    destinationBankCode: string;
  };
}

/**
 * Monnify Error Response
 */
export interface MonnifyErrorResponse {
  requestSuccessful: false;
  responseMessage: string;
  responseCode: string;
  responseBody?: any;
}

/**
 * Monnify Reserved Account Request
 */
export interface MonnifyReservedAccountRequest {
  accountReference: string;
  accountName: string;
  currencyCode: string;
  contractCode: string;
  customerEmail: string;
  customerName?: string;
  getAllAvailableBanks?: boolean;
  preferredBanks?: string[];
}

/**
 * Monnify Reserved Account Response
 */
export interface MonnifyReservedAccountResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    contractCode: string;
    accountReference: string;
    accountName: string;
    currencyCode: string;
    customerEmail: string;
    customerName: string;
    accounts: Array<{
      bankCode: string;
      bankName: string;
      accountNumber: string;
    }>;
    collectionChannel: string;
    reservationReference: string;
    reservedAccountType: string;
    status: string;
    createdOn: string;
  };
}

/**
 * Monnify Configuration
 */
export interface MonnifyConfig {
  apiKey: string;
  secretKey: string;
  contractCode: string;
  baseUrl: string;
  webhookSecret?: string;
}

/**
 * Monnify Payment Method
 */
export type MonnifyPaymentMethod = 
  | 'CARD' 
  | 'ACCOUNT_TRANSFER' 
  | 'USSD' 
  | 'PHONE_NUMBER';