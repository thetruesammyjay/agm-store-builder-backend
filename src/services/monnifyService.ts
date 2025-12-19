/**
 * AGM Store Builder - Monnify Service
 * Integration with Monnify payment gateway
 */

import axios, { AxiosInstance } from 'axios';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { errors } from '../middleware/errorHandler';

/**
 * Monnify API Response Types
 */
export interface MonnifyPaymentResponse {
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
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    amount: number;
    expiresOn: string;
  };
  transactionReference?: string; // Top-level for backward compatibility
}

export interface MonnifyVerificationResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    transactionReference: string;
    paymentReference: string;
    amountPaid: number;
    totalPayable: number;
    settlementAmount: number;
    paidOn: string;
    paymentStatus: string;
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
      expiryMonth: string;
      expiryYear: string;
      countryCode: string;
      bankCode: string;
    };
    accountDetails?: {
      accountName: string;
      accountNumber: string;
      bankCode: string;
      amountPaid: number;
    };
    accountPayments?: Array<{
      accountName: string;
      accountNumber: string;
      bankCode: string;
      bankName: string;
      amountPaid: number;
      paymentStatus: string;
      paidOn: string;
      paymentReference: string;
    }>;
    customer: {
      email: string;
      name: string;
    };
    metaData?: any;
  };
}

export interface InitializePaymentData {
  amount: number;
  customerEmail: string;
  customerName: string;
  paymentDescription: string;
  contractCode?: string;
  redirectUrl?: string;
  incomeSplitConfig?: any[];
}

export interface MonnifyTransferData {
  amount: number;
  reference: string;
  narration: string;
  destinationBankCode: string;
  destinationAccountNumber: string;
  currency?: string;
  sourceAccountNumber?: string;
}

export interface MonnifyAuthResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseBody: {
    accessToken: string;
    expiresIn: number;
  };
}

/**
 * Monnify Service Class
 */
class MonnifyService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: config.monnify.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Monnify API Error', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get access token (with caching)
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(
        `${config.monnify.apiKey}:${config.monnify.secretKey}`
      ).toString('base64');

      const response = await this.client.post<MonnifyAuthResponse>(
        '/api/v1/auth/login',
        {},
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      if (!response.data.requestSuccessful) {
        throw new Error('Failed to authenticate with Monnify');
      }

      this.accessToken = response.data.responseBody.accessToken;
      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = Date.now() + (response.data.responseBody.expiresIn - 300) * 1000;

      logger.info('Monnify access token obtained');
      return this.accessToken;
    } catch (error: any) {
      logger.error('Monnify authentication failed', error);
      throw errors.externalService('Monnify authentication failed');
    }
  }

  /**
   * Initialize payment - Create reserved account
   */
  async initializePayment(data: InitializePaymentData): Promise<MonnifyPaymentResponse> {
    try {
      const token = await this.getAccessToken();

      const payload = {
        amount: data.amount,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        paymentReference: `AGM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        paymentDescription: data.paymentDescription,
        contractCode: data.contractCode || config.monnify.contractCode,
        redirectUrl: data.redirectUrl || config.appUrl,
        paymentMethods: ['ACCOUNT_TRANSFER', 'CARD'],
        incomeSplitConfig: data.incomeSplitConfig || [],
      };

      const response = await this.client.post<MonnifyPaymentResponse>(
        '/api/v1/merchant/transactions/init-transaction',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.requestSuccessful) {
        throw new Error(response.data.responseMessage || 'Payment initialization failed');
      }

      logger.info('Payment initialized', {
        reference: response.data.responseBody.transactionReference,
        amount: data.amount,
      });

      // Add transactionReference to top level for backward compatibility
      return {
        ...response.data,
        transactionReference: response.data.responseBody.transactionReference,
      };
    } catch (error: any) {
      logger.error('Payment initialization failed', error);
      throw errors.externalService('Failed to initialize payment');
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(transactionReference: string): Promise<MonnifyVerificationResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get<MonnifyVerificationResponse>(
        `/api/v1/merchant/transactions/query?paymentReference=${transactionReference}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.requestSuccessful) {
        throw new Error(response.data.responseMessage || 'Payment verification failed');
      }

      logger.info('Payment verified', {
        reference: transactionReference,
        status: response.data.responseBody.paymentStatus,
      });

      return response.data;
    } catch (error: any) {
      logger.error('Payment verification failed', {
        reference: transactionReference,
        error: error.message,
      });
      throw errors.externalService('Failed to verify payment');
    }
  }

  /**
   * Initiate transfer/payout
   */
  async initiateTransfer(data: MonnifyTransferData): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const payload = {
        amount: data.amount,
        reference: data.reference,
        narration: data.narration,
        destinationBankCode: data.destinationBankCode,
        destinationAccountNumber: data.destinationAccountNumber,
        currency: data.currency || 'NGN',
        sourceAccountNumber: data.sourceAccountNumber || config.monnify.contractCode,
      };

      const response = await this.client.post(
        '/api/v2/disbursements/single',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.requestSuccessful) {
        throw new Error(response.data.responseMessage || 'Transfer failed');
      }

      logger.info('Transfer initiated', {
        reference: data.reference,
        amount: data.amount,
      });

      return response.data;
    } catch (error: any) {
      logger.error('Transfer initiation failed', error);
      throw errors.externalService('Failed to initiate transfer');
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(reference: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get(
        `/api/v2/disbursements/single/summary?reference=${reference}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Failed to get transaction status', error);
      throw errors.externalService('Failed to get transaction status');
    }
  }

  /**
   * Get all supported banks
   */
  async getBanks(): Promise<any[]> {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get(
        '/api/v1/banks',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.requestSuccessful) {
        throw new Error('Failed to fetch banks');
      }

      return response.data.responseBody;
    } catch (error: any) {
      logger.error('Failed to fetch banks', error);
      return [];
    }
  }

  /**
   * Verify bank account
   */
  async verifyBankAccount(accountNumber: string, bankCode: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get(
        `/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.requestSuccessful) {
        throw new Error('Account verification failed');
      }

      return response.data.responseBody;
    } catch (error: any) {
      logger.error('Bank account verification failed', error);
      throw errors.externalService('Failed to verify bank account');
    }
  }
}

// Export singleton instance
export const monnifyService = new MonnifyService();

// Export named functions for backward compatibility
export const initializePayment = (data: InitializePaymentData) => 
  monnifyService.initializePayment(data);

export const verifyPayment = (reference: string) => 
  monnifyService.verifyPayment(reference);

export const initiateTransfer = (data: MonnifyTransferData) => 
  monnifyService.initiateTransfer(data);

export const getTransactionStatus = (reference: string) => 
  monnifyService.getTransactionStatus(reference);

export const getBanks = () => 
  monnifyService.getBanks();

export const verifyBankAccount = (accountNumber: string, bankCode: string) => 
  monnifyService.verifyBankAccount(accountNumber, bankCode);