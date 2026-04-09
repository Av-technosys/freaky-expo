import { publicApi } from './axios';

type LoginPayload = {
  email: string;
  password: string;
};


type ConfirmOtpPayload = {
  email: string;
  code: string;
};

type ResendOtpPayload = {
  username: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type ConfirmForgotPasswordPayload = {
  username: string;
  code: string;
  newPassword: string;
};


export const login = async (payload: LoginPayload) => {
  const response = await publicApi.post('/auth/signin', payload);
  return response.data;
};


export const Signup = (payload: {
  full_name: string;
  number: string;
  email: string;
  password: string;
}) => {
  return publicApi.post('/auth/signup', payload);
};


export const confirmOtp = async (payload: ConfirmOtpPayload) => {
  const { data } = await publicApi.post('/auth/confirm', payload);
  return data;
};

export const resendOtp = async (payload: ResendOtpPayload) => {
  const { data } = await publicApi.post('/auth/resend-otp', payload);
  return data;
};


export const forgotPassword = async (
  payload: ForgotPasswordPayload
) => {
  const { data } = await publicApi.post(
    '/auth/forgot-password',
    payload
  );
  return data;
};

export const confirmForgotPassword = async (
  payload: ConfirmForgotPasswordPayload
) => {
  const { data } = await publicApi.post(
    '/auth/confirm_forgot_password',
    payload
  );
  return data;
};