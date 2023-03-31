import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { getProducts } from "../../lib/Products";
import { IProductProps, ProductsTableLine } from "./ProductsTableLine";
import { ProductsTableTitle } from "./ProductTableTitle";
import { IProduct, IProductQuery } from "../../types";
import { ProductsFilter } from "./ProductsFilter";
import { Link } from "react-router-dom";

export function ProductsTable() {
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [productsQuantity, setProductsQuantity] = useState<number>(0);
  const [updateResults, setUpdateResults] = useState<boolean>(false);
  const [messageBox, setMessageBox] = useState<string | null>(null);
  const [filterScumMasterName, setFilterScrumMasterName] = useState<string>("");
  const [filterDeveloper, setFilterDeveloper] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      setMessageBox("Loading data...");
      try {
        const data: IProduct[] = await getProducts({
          scrumMasterName: filterScumMasterName,
          developer: filterDeveloper,
        });
        setMessageBox(null);
        setProducts(data);
        setProductsQuantity(data.length);
      } catch (error: AxiosError | any) {
        console.log(error);
        setMessageBox(
          `It wasn't possible to retrieve products. Please try again later (${error?.response?.status})`
        );
      }
    };

    getData();
  }, [updateResults]);

  function filterProducts({ developer, scrumMasterName }: IProductQuery) {
    setFilterScrumMasterName(scrumMasterName);
    setFilterDeveloper(developer);
    setUpdateResults(!updateResults);
  }

  return (
    <div className="flex flex-col flex-auto h-full w-full p-10 bg-slate-200">
      <div className="flex justify-center p-2 text-2xl font-bold">
        Products List
      </div>
      <div className="flex flex-row justify-between h-16 bg-slate-100 p-2 border-2 border-slate-300">
        <div className="grow flex items-center">
          <span className="text-gray-700 font-bold px-2">
            {productsQuantity}
          </span>
          product(s) found
        </div>

        {/* <div className="flex justify-center h-12 bg-slate-200 p-2"> */}

        <div className="flex items-center justify-center">
          <button
            type="button"
            className="w-44 h-8 rounded-md bg-lime-700 hover:bg-lime-600 transition-all text-white font-semibold"
          >
            <Link to={{ pathname: `/productform/` }}>Add New Product</Link>
          </button>
        </div>
      </div>
      <div className="grid grid-flow-row grid-cols-8 bg-slate-300 text-sm border-2 border-slate-400">
        <ProductsTableTitle />
        <ProductsFilter setFilter={filterProducts} />
        {messageBox ? (
          <div className="col-span-7 flex justify-center items-center h-8 text-base">
            {messageBox}
          </div>
        ) : (
          products &&
          products.map((product, key) => (
            <ProductsTableLine {...(product as IProductProps)} key={key} />
          ))
        )}
      </div>
    </div>
  );
}
