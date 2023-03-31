import { Request, Response, NextFunction } from "express";
import { Products, IProduct, IProductQuery } from "../../models/product";

export const ProductController = {
  async list(request: Request, response: Response, next: NextFunction) {
    const { scrumMasterName, developer } = request.query;

    try {
      const products = await Products.getProducts({
        scrumMasterName,
        developer,
      } as IProductQuery);
      response.status(200).send(products);
    } catch (err: any) {
      next(err);
    }
  },

  async getById(request: Request, response: Response, next: NextFunction) {
    const { productId } = request.params;

    try {
      const product = await Products.getProductById(productId);
      response.status(200).send(product);
    } catch (err: any) {
      next(err);
    }
  },

  async insert(request: Request, response: Response, next: NextFunction) {
    const product = request.body as unknown as IProduct;

    try {
      const result = await Products.addProduct(product);
      return response.status(201).send(result);
    } catch (err: any) {
      next(err);
    }
  },

  async updateById(request: Request, response: Response, next: NextFunction) {
    const product = request.body as unknown as IProduct;
    const productId = request.params.productId;

    try {
      const updateProduct = await Products.updateProduct(productId, product);
      return response.status(200).send(updateProduct.data);
    } catch (err: any) {
      next(err);
    }
  },
};
