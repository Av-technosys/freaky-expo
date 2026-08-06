import Constants, { ExecutionEnvironment } from 'expo-constants';

type RazorpayCheckout = typeof import('react-native-razorpay').default;

export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export class RazorpayCheckoutUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RazorpayCheckoutUnavailableError';
  }
}

/**
 * Razorpay is a native SDK. Keep the import behind this guard so Expo Go can
 * show a helpful message instead of crashing when a user taps checkout.
 */
export function getRazorpayCheckout(): RazorpayCheckout {
  if (isExpoGo) {
    throw new RazorpayCheckoutUnavailableError(
      'Payments need the app development build. Expo Go cannot open Razorpay.',
    );
  }

  try {
    const RazorpayCheckout = require('react-native-razorpay').default as RazorpayCheckout;

    if (!RazorpayCheckout?.open) {
      throw new Error('Razorpay native module is unavailable');
    }

    return RazorpayCheckout;
  } catch {
    throw new RazorpayCheckoutUnavailableError(
      'Payments need a freshly installed app development build.',
    );
  }
}
