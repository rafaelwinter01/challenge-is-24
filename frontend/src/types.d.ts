export interface IProduct {
  productId?: string;
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
