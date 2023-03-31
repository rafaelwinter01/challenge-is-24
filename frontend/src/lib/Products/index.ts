import axios, { AxiosResponse } from "axios";
import { Params } from "react-router-dom";
import { IProduct, IProductQuery } from "../../types";

const apiURL = "http://localhost:3000/api/";

export async function getProducts({
  scrumMasterName,
  developer,
}: IProductQuery): Promise<IProduct[]> {
  try {
    const apiCall: AxiosResponse<IProduct[]> = await axios.get(
      `${apiURL}products?`,
      { params: { scrumMasterName, developer } }
    );
    return apiCall.data;
  } catch (error) {
    throw error;
  }
}

export async function getProduct(productId: string): Promise<IProduct> {
  try {
    const apiCall: AxiosResponse<IProduct> = await axios.get(
      `${apiURL}product/${productId}`
    );
    return apiCall.data;
  } catch (error) {
    throw error;
  }
}

export async function addProduct(product: IProduct): Promise<IProduct> {
  try {
    const apiCall: AxiosResponse<IProduct> = await axios.post(
      `${apiURL}product/`,
      product
    );

    return apiCall.data;
  } catch (error) {
    throw error;
  }
}

export async function updateProduct(
  productId: string,
  product: IProduct
): Promise<number> {
  try {
    const apiCall: AxiosResponse<number> = await axios.put(
      `${apiURL}product/${productId}`,
      product
    );
    return 200;
  } catch (error) {
    throw error;
  }
}
