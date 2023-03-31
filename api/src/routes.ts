import { Request, Response, Router, NextFunction } from "express";
import { ProductController } from "./controlers/product";

export const routes = Router();

/* Product Routes */
routes.get("/api/products", ProductController.list);
routes.get("/api/product/:productId", ProductController.getById);
routes.post("/api/product/", ProductController.insert);
routes.put("/api/product/:productId", ProductController.updateById);

/* Error handling */
routes.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    let statusCode = 0;
    if (isNaN(parseInt(error.message))) {
      statusCode = 500;
    } else {
      statusCode = parseInt(error.message);
    }
    response.status(statusCode).json({ message: error.message });
  }
);
