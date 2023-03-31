import { Link } from "react-router-dom";

export interface IProductProps {
  key: number;
  productId: string;
  productName: string;
  productOwnerName: string;
  Developers: Array<string>;
  scrumMasterName: string;
  startDate: string;
  methodology: string;
}

export function ProductsTableLine({
  productId,
  productName,
  productOwnerName,
  Developers,
  scrumMasterName,
  startDate,
  methodology,
}: IProductProps) {
  const productIdFormatted = String(productId).padStart(8, "0");

  return (
    <>
      <div className="flex justify-center items-center p-1 truncate border-b-2 border-slate-200">
        <button
          type="button"
          className="hover:underline hover:underline-offser-2"
        >
          <Link to={{ pathname: `/product/${productId}` }}>
            {productIdFormatted}
          </Link>
        </button>
      </div>
      <div className="flex items-center p-1 truncate border-b-2 border-slate-200">
        <div>{productName}</div>
      </div>
      <div className="flex items-center p-1 truncate border-b-2 border-slate-200">
        {productOwnerName}
      </div>
      <div className="flex flex-col justify-center p-1 truncate border-b-2 border-slate-200">
        {Developers.map((developer, key) => (
          <div key={key} className="truncate">
            {developer}
          </div>
        ))}
      </div>
      <div className="flex items-center p-1 truncate border-b-2 border-slate-200">
        {scrumMasterName}
      </div>
      <div className="flex items-center justify-center p-1 truncate border-b-2 border-slate-200">
        {startDate}
      </div>
      <div className="flex items-center justify-center p-1 truncate border-b-2 border-slate-200">
        {methodology}
      </div>
      <div className="flex items-center justify-center p-1 truncate border-b-2 border-slate-200">
        <button
          className="mx-2 w-full text-xs h-6 rounded-md bg-slate-600 hover:bg-slate-500 transition-all text-white font-semibold"
          type="button"
        >
          <Link to={{ pathname: `/productform/${productId}` }}>
            Edit Product
          </Link>
        </button>
      </div>
    </>
  );
}
