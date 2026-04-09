import { privateApi } from './axios';



export const getProductTypes = async () => {
  const response = await privateApi.get('/product/products_type');
  return response.data;
};

export const getProductsByCategoryId = async (categoryId: number) => {
  const response = await privateApi.get(
    `/product/products_by_categoryId/${categoryId}`,
  );
  return response.data; 
};


export const getProductsByProductId = async (productId: number) => {
  const response = await privateApi.get(
    `/product/info?productId=${productId}`,
  );
  return response.data; 
};


export const getProductsByProductTypeId = async (
  productTypeId: number, 
  page: number = 1, 
  pageSize: number = 10
) => {
  const response = await privateApi.get(
    `/product/by_product_type_id?productTypeId=${productTypeId}&page=${page}&page_size=${pageSize}`,
  );
  return response.data;
};



export const getAllFeaturedProducts = async () => {
   const response = await privateApi.get(
    `/product/featuredProducts`,
  );
  return response.data;
}

export const fetchProductReview = async (productId: number) => {
  const response = await privateApi.get(
    `/product/reviews/${productId}`
  );
  return response.data;
};
