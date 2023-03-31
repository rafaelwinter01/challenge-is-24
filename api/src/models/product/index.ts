import axios, { AxiosResponse, AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.JSON_SERVER_PORT || 3001;
const jsonServerURL = `http://localhost:${port}`;

export interface IProduct {
  productId: string;
  productName: string;
  productOwnerName: string;
  Developers: Array<string>;
  scrumMasterName: string;
  startDate: string;
  methodology: string;
}

interface IProductServer {
  id: number;
  productName: string;
  productOwnerName: string;
  Developers: Array<string>;
  scrumMasterName: string;
  startDate: string;
  methodology: string;
}

export interface IProductQuery {
  scrumMasterName: string;
  developer: string;
}

function validateProduct(product: IProduct): boolean {
  const {
    productName,
    productOwnerName,
    Developers,
    scrumMasterName,
    startDate,
    methodology,
  } = product;

  if (!productName || productName == "") {
    return false;
  }
  if (!productOwnerName || productOwnerName == "") {
    return false;
  }
  if (!scrumMasterName || scrumMasterName == "") {
    return false;
  }
  if (!startDate || startDate == "") {
    return false;
  }
  if (!methodology || methodology == "") {
    return false;
  }
  if (!Developers || Developers.length <= 0) {
    return false;
  }

  return true;
}

export const Products = {
  async getProducts({
    scrumMasterName,
    developer,
  }: IProductQuery): Promise<IProduct[]> {
    try {
      const searchScrumMasterName = scrumMasterName
        ? `scrumMasterName_like=${scrumMasterName}`
        : `scrumMasterName_like=`;
      const searchDeveloper = developer
        ? `Developers_like=${developer}`
        : `Developers_like=`;

      const products = (await axios.get(
        `${jsonServerURL}/products?${searchScrumMasterName}&${searchDeveloper}`
      )) as AxiosResponse;

      return products.data as IProduct[];
    } catch (error: AxiosError | any) {
      let statusCode = error.response ? error.response.status : 500;
      throw new Error(`${statusCode}: ${error.message}`);
    }
  },

  async getProductById(productId: string): Promise<IProduct> {
    let statusCode = 0;
    try {
      const product = (await axios.get<IProduct>(
        `${jsonServerURL}/products?productId=${productId}`
      )) as AxiosResponse;

      if (product.data[0]) {
        return product.data[0] as IProduct;
      } else {
        statusCode = 404;
        throw new Error(`ProductId ${productId} not found`);
      }
    } catch (error: AxiosError | any) {
      if (statusCode === 0) {
        if (error.response) {
          statusCode = error.response.status;
        } else {
          statusCode = 500;
        }
      }

      throw new Error(
        `${statusCode}: It was not possible to retrieve the product. ${error}`
      );
    }
  },

  async addProduct(product: IProduct) {
    let statusCode = 0;
    try {
      const getNextId = (await axios.get(
        `${jsonServerURL}/productId`
      )) as AxiosResponse;

      let id = Number(getNextId.data.nextId);

      product.productId = String(getNextId.data.nextId);
      if (!validateProduct(product)) {
        statusCode = 422;
        throw new Error(
          `It is not possible to create the product. All fields are required`
        );
      }

      await axios.post(`${jsonServerURL}/productId/`, {
        nextId: id + 1,
      });

      /* JSON-SERVER always ask for id Product, information will be duplicated just to keep the format */
      const jsProduct = {
        id: id,
        ...product,
      } as IProductServer;

      const response = await axios.post(
        `${jsonServerURL}/products/`,
        jsProduct
      );

      return response.data;
    } catch (error: AxiosError | any) {
      if (statusCode === 0) {
        if (error.response) {
          statusCode = error.response.status;
        } else {
          statusCode = 500;
        }
      }

      throw new Error(`${statusCode}: ${error.message}`);
    }
  },

  async updateProduct(productId: string, product: IProduct) {
    let statusCode = 0;
    try {
      product.productId = productId;
      validateProduct(product);
      if (!validateProduct(product)) {
        statusCode = 422;
        throw new Error(
          `It is not possible to update the product. All fields are required`
        );
      }

      const response = await axios.put(
        `${jsonServerURL}/products/${productId}`,
        product
      );

      return response;
    } catch (error: AxiosError | any) {
      if (statusCode === 0) {
        if (error.response) {
          statusCode = error.response.status;
        } else {
          statusCode = 500;
        }
      }
      throw new Error(`${statusCode}: ${error.message}`);
    }
  },
};
