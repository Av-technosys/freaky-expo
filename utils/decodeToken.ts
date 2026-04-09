import {jwtDecode} from 'jwt-decode';


export type CognitoIdToken = {
  sub: string;
  email: string;
  email_verified: boolean;

  iss: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  token_use: 'id';

  'custom:user_id'?: string;
  'custom:user_type'?: string;
'cognito:username': string;
  [key: string]: any;
};


export type AppUser = {
  userId: string;         
  email: string;
  type: number;        
  cognitoId: string;   
  username: string;   
  exp: number;
};

export const decodeIdToken = (token: string): AppUser => {
  const decoded = jwtDecode<CognitoIdToken>(token);

  return {
    userId: decoded['custom:user_id'] ?? '',
    email: decoded.email,
    type: Number(decoded['custom:user_type'] ?? 0),
    cognitoId: decoded.sub,
    username: decoded['cognito:username'] ?? decoded.sub,
    exp: decoded.exp,
  };
};
