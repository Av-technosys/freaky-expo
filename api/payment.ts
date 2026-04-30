import { privateApi } from './axios'


export const createPaymentOrder = async (payload: { amount: number }) => {
  const response = await privateApi.post('/payment/create-order', payload)
  return response.data
}

export const verifyPayment = async (payload: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  amount: number
  source: 'CART' | 'EVENT'
  sourceId: number
  bookingDetails?: any
}) => {
  const response = await privateApi.post('/payment/verify', payload)
  return response.data
}