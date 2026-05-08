import { privateApi } from './axios';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';


export type Address = {
  id?: number;
  title: string;
  addressLineOne: string;
  addressLineTwo: string;
  reciverName: string;
  reciverNumber: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: string;
  longitude?: string;
};



export const userDetails = async () => {
  const response = await privateApi.get('/user/get_personal_info');
  return response.data;
};


export const updateUserProfile = async (
  payload: any,
) => {
  const response = await privateApi.post(
    '/user/update_personal_info',
    payload,
  );
  return response.data;
};


//upload on s3

export const getBucketUrl = async (payload: any) => {
  const response = await privateApi.post('/upload/get_S3_url', payload);
  return response.data;
};


export const setProfilePicture = async (payload :any) => {
  const response = await privateApi.post('/user/profile_picture', payload);
  return response.data;
};


export const deleteProfilePicture = async (payload :any) => {
  const response = await privateApi.delete('/upload/profile_picture', payload);
  return response.data;
};


//addrsess

export const getAddresses = async () => {
  const response = await privateApi.get('/user/address');
  return response.data;
};

export const addAddress = async (payload: Address) => {
  const response = await privateApi.post('/user/address/add', payload);
  return response.data;
};

export const editAddress = async (payload: Address) => {
  const response = await privateApi.put('/user/address/edit', payload);
  return response.data;
};

export const deleteAddress = async (payload: { id: number }) => {
  const response = await privateApi.delete('/user/address/delete', {
    data: payload, 
  });
  return response.data;
};


export const setCurrentAddress = async (payload: any) => {
  const response = await privateApi.post('/user/address/set_current', payload);
  return response.data;
};


export const fetchCurrentAddress = async (addressId: number) => {
  const response = await privateApi.get(
    `/user/address/current_address/${addressId}`
  );
  return response.data;
};


export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    staleTime: 1000 * 60 * 5,
  });
};


export const useCurrentAddress = (addressId: number) => {
  return useQuery({
    queryKey: ['current-address', addressId],
    queryFn: () => fetchCurrentAddress(addressId),
    enabled: !!addressId,
    staleTime: 1000 * 60 * 5,
  });
};


export const useUserDetails = () => {
  return useQuery({
    queryKey: ['user-details'],
    queryFn: userDetails,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSetCurrentAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCurrentAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });

      queryClient.invalidateQueries({
        queryKey: ['current-address'],
      });
    },
  });
};



export const useEditAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });

      queryClient.invalidateQueries({
        queryKey: ['current-address'],
      });
    },
  });
};