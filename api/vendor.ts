import { privateApi } from "./axios";

export const fetchVendorDetail = async (productId: string) => {
  const response = await privateApi.get(`/vendor/detail/${productId}`);
  return response.data;
};
