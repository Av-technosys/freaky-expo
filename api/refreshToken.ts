import axios from 'axios';
import { tokenStorage } from '../api/services/tokenStorage';


const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || ""

export const refreshIdToken = async () => {

  console.log('he is calling to refersh')
  const refreshToken = await tokenStorage.getRefreshToken();
  const username = await tokenStorage.getUsername();


   console.log('refreshToken', refreshToken);
   console.log('username', username);

  if (!refreshToken || !username) {
    throw new Error('Missing refresh credentials');
  }

  const { data } = await axios.post(
    `${BASE_URL}/auth/refresh_token`,
    { refreshToken, username },
  );
  const newIdToken =
    data?.response?.AuthenticationResult?.IdToken;

     console.log('newIdToken', newIdToken);
  if (!newIdToken) {
    throw new Error('Invalid refresh response');
  }

  await tokenStorage.setIdToken(newIdToken);

  console.log('ID token refreshed successfully');
  return newIdToken;
};
