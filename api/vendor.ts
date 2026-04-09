import { privateApi } from "./axios";

export const fetchVendorDetail = async () => {
  const response = await privateApi.get(
    `/vendor/detail`,
  );
  return response.data; 
};
