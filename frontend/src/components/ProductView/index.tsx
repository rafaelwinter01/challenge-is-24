import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { getProduct, addProduct, updateProduct } from "../../lib/Products";
import { IProduct } from "../../types";

const cssErrorClass = "bg-red-200";

export function ProductView() {
  const { productId } = useParams<{ productId: string }>();
  const [errors, setErrors] = useState<string[] | null>(null);
  const [formTitle, setFormTitle] = useState<string>("Add New Product");
  const [productIdTitle, setProductIdTitle] = useState<string>("Loading...");
  const [productIdForward, setProductIdForward] = useState<string>("invalid");

  const [product, setProduct] = useState<IProduct>({
    productName: "",
    productOwnerName: "",
    Developers: [""],
    scrumMasterName: "",
    startDate: "",
    methodology: "",
  });

  useEffect(() => {
    const getData = async (id: string) => {
      try {
        const data: IProduct = await getProduct(id);
        setProduct(data as IProduct);
        let idTitle = productId?.padStart(8, "0");
        setProductIdTitle(idTitle ? idTitle : `Error`);
      } catch (error: AxiosError | any) {
        let idTitle = productId?.padStart(8, "0");
        setProductIdTitle(`Couldn't retrieve product number ${idTitle}`);
      }
    };

    if (productId) {
      getData(productId);
      setFormTitle("Product View");
    }
  }, []);

  return (
    <div className="flex flex-col bg-slate-200 p-10">
      <div className="flex flex-col flex-auto bg-slate-200 w-9/12 max-w-lg gap-4 self-center border-2 border-slate-400">
        <div className="flex justify-center items-center bg-slate-500 h-12 text-white font-semibold truncate">
          <h2>Product View</h2>
        </div>
        {productId && (
          <div className="flex flex-col justify-center items-center overflow-hidden">
            <div className="text-xs font-semibold">Product Number</div>
            <div className="text-lg font-bold truncate">{productIdTitle}</div>
          </div>
        )}
        <div className="flex flex-col px-10 pb-10 gap-2">
          <div>
            Product Name
            <div className="flex items-center h-8 p-2 bg-slate-100 rounded truncate">
              {product.productName}
            </div>
          </div>
          <div>
            Scrum Master
            <div className="flex items-center h-8 p-2 bg-slate-100 rounded truncate">
              {product.scrumMasterName}
            </div>
          </div>
          <div>
            Product Owner
            <div className="flex items-center h-8 p-2 bg-slate-100 rounded truncate">
              {product.productOwnerName}
            </div>
          </div>
          <div>
            Developer Names
            <div className="flex flex-col gap-1 p-2 bg-slate-100 rounded">
              {product.Developers.map((developer, key) => (
                <div
                  className="flex flex-row gap-2 items-center truncate"
                  key={key}
                >
                  {product.Developers[key]}
                </div>
              ))}
            </div>
          </div>
          <div>
            Start Date
            <div className="flex items-center h-8 p-2 bg-slate-100 rounded">
              {product.startDate}
            </div>
          </div>
          <div>
            Methodology
            <div className="flex items-center h-8 p-2 bg-slate-100 rounded">
              {product.methodology}
            </div>
          </div>

          <div className="flex flex-col justify-center pt-4 gap-2">
            <button
              type="button"
              className="w-full h-8 rounded-md bg-slate-600 hover:bg-slate-500 transition-all text-white font-semibold"
            >
              <Link to={{ pathname: `/` }}>Return to Products List</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
