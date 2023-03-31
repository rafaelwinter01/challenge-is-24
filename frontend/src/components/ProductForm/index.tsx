import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { getProduct, addProduct, updateProduct } from "../../lib/Products";
import { IProduct } from "../../types";

const cssErrorClass = "bg-red-200";

export function ProductForm() {
  const { productId } = useParams<{ productId: string }>();
  const [successBoxMessage, setSuccessBoxMessage] = useState<string | null>(
    null
  );
  const [errors, setErrors] = useState<string[] | null>(null);
  const [formTitle, setFormTitle] = useState<string>("Add New Product");
  const [productIdTitle, setProductIdTitle] = useState<string>("Loading...");
  const [productIdForward, setProductIdForward] = useState<string>("invalid");

  const date = new Date();
  const [product, setProduct] = useState<IProduct>({
    productName: "",
    productOwnerName: "",
    Developers: [""],
    scrumMasterName: "",
    startDate: `${date.getFullYear().toString()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`,
    methodology: "Agile",
  });

  useEffect(() => {
    const getData = async (id: string) => {
      try {
        const data: IProduct = await getProduct(id);
        setProduct(data as IProduct);
        let idTitle = productId?.padStart(8, "0");
        setProductIdTitle(idTitle ? idTitle : `Error`);
      } catch (error: AxiosError | any) {
        console.log(error);
        let idTitle = productId?.padStart(8, "0");
        setProductIdTitle(`Couldn't retrieve product number ${idTitle}`);
        /* @ts-ignore */
        document.getElementById("buttonSubmit").hidden = true;
      }
    };

    if (productId) {
      getData(productId);
      setFormTitle("Edit Product");
    }
  }, []);

  /* Will handle change all commom string fields of the form */
  function handleChangeProductField(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    /* @ts-ignore */
    setProduct({ ...product, [event.target.name]: event.target.value });
    event.target.classList.remove(cssErrorClass);
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setProduct({
      ...product,
      methodology: event.target.value,
    });
  }

  function handleChangeDeveloper(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    let { Developers } = product;
    Developers[index] = event.target.value;
    /* @ts-ignore */
    setProduct({ ...product, Developers: Developers });
  }

  function handleAddDeveloper() {
    let { Developers } = product;
    if (Developers.length < 5) Developers[Developers.length] = "";
    setProduct({ ...product, Developers: Developers });
  }

  function handleDeleteDeveloper(index: number) {
    let { Developers } = product;
    Developers.splice(index, 1);
    setProduct({ ...product, Developers });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (typeof productId == "string") {
        await updateProduct(productId, product);
        setProductIdForward(productId);
      } else {
        const savedProduct = await addProduct(product);
        savedProduct && setProductIdForward(savedProduct.productId as string);
      }
      setSuccessBoxMessage("Product Saved Successfully");
    } catch (error) {
      let errorsArray = [];
      errorsArray.push(
        `It wasn't possible to save product. Please try again later (${error?.response?.status})`
      );
      setErrors(errorsArray);
    }
  }

  function validateForm() {
    setErrors(null);
    let errors = [];
    let valid = true;

    /* Validate String Fields*/
    for (const field in product) {
      const inputField = document.querySelector(
        `input[name=${field}]`
      ) as HTMLInputElement;
      if (inputField && inputField?.value === "") {
        inputField.classList.add(cssErrorClass);
        valid = false;
      }
    }

    if (!valid) {
      errors.push("Please fill out all required fields.");
    }

    /* Validate startDate Input */
    const dateFormat = /^(\d{4})\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/; // RegEx Date Format yyyy/mm/dd
    const dateInput = document.querySelector(
      `input[name=startDate]`
    ) as HTMLInputElement;
    if (!dateFormat.test(dateInput?.value)) {
      dateInput.classList.add(cssErrorClass);

      errors.push("Start Date must be a valid date");
      valid = false;
    }

    let { Developers } = product;
    Developers = Developers.filter((developer) => developer !== "");
    if (Developers.length < 1) {
      errors.push("At least one developer must be provided");
      valid = false;
    }
    setProduct({ ...product, Developers });

    if (!valid) {
      setErrors(errors);
    }

    return valid;
  }

  return (
    <div className="flex flex-col bg-slate-200 p-10">
      <div className="flex flex-col flex-auto bg-slate-200 w-9/12 max-w-lg gap-4 self-center border-2 border-slate-400">
        <div className="flex justify-center items-center bg-slate-500 h-12 text-white font-semibold truncate">
          <h2>{formTitle}</h2>
        </div>
        {productId && (
          <div className="flex flex-col justify-center items-center overflow-hidden">
            <div className="text-xs font-semibold">Product Number</div>
            <div className="text-lg font-bold truncate">{productIdTitle}</div>
          </div>
        )}
        <div className="px-10 pb-10">
          <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
            {successBoxMessage ? (
              <>
                <div className="mb-10 w-full h-28 flex justify-center items-center text-xl font-bold border-2 border-green-400 bg-green-200">
                  {successBoxMessage}
                </div>
                <button
                  type="button"
                  className="w-full h-8 rounded-md bg-slate-600 hover:bg-slate-500 transition-all text-white font-semibold"
                >
                  <Link to={{ pathname: `/product/${productIdForward}` }}>
                    View Product
                  </Link>
                </button>
              </>
            ) : (
              <>
                <div>
                  Product Name
                  <input
                    className="border-2 border-slate-400 px-1 w-full"
                    type="text"
                    name="productName"
                    value={product.productName}
                    onChange={handleChangeProductField}
                  />
                </div>
                <div>Scrum Master</div>
                <div>
                  <input
                    className="border-2 border-slate-400 px-1 w-full"
                    type="text"
                    name="scrumMasterName"
                    value={product.scrumMasterName}
                    onChange={handleChangeProductField}
                  />
                </div>
                <div>Product Owner</div>
                <div>
                  <input
                    className="border-2 border-slate-400 px-1 w-full"
                    type="text"
                    name="productOwnerName"
                    value={product.productOwnerName}
                    onChange={handleChangeProductField}
                  />
                </div>
                <div>
                  Developer Names
                  <div className="flex flex-col gap-1 ">
                    {product.Developers.map((developer, key) => (
                      <div
                        className="flex flex-row gap-2 items-center"
                        key={key}
                      >
                        <input
                          className="border-2 border-slate-400 px-1 w-full"
                          type="text"
                          name={`Developer${key}`}
                          value={product.Developers[key]}
                          onChange={(event) =>
                            handleChangeDeveloper(event, key)
                          }
                        />
                        {product.Developers.length > 1 && (
                          <button
                            className="w-11 text-xs h-6 rounded-sm bg-slate-600 hover:bg-slate-500 transition-all text-white font-semibold"
                            type="button"
                            onClick={() => handleDeleteDeveloper(key)}
                          >
                            -
                          </button>
                        )}
                      </div>
                    ))}
                    {product.Developers.length < 5 && (
                      <button
                        className="w-full text-xs h-6 rounded-sm bg-slate-600 hover:bg-slate-500 transition-all text-white font-semibold"
                        type="button"
                        onClick={handleAddDeveloper}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  Start Date
                  <input
                    className="border-2 border-slate-400 px-1 w-full"
                    type="text"
                    name="startDate"
                    value={product.startDate}
                    onChange={handleChangeProductField}
                    readOnly={productId ? true : false}
                  />
                </div>
                <div>
                  Methodology
                  <select
                    className="border-2 border-slate-400 px-1 w-full"
                    value={product.methodology}
                    onChange={handleSelectChange}
                  >
                    <option value="Waterfall">Waterfall</option>
                    <option value="Agile">Agile</option>
                  </select>
                </div>

                {errors && (
                  <div className="flex flex-col justify-center bg-red-200 border-2 border-red-300 p-2">
                    {errors.map((error, key) => (
                      <div key={key}>{error}</div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col justify-center pt-4 gap-2">
                  <button
                    id="buttonSubmit"
                    className="w-full h-8 rounded-md bg-sky-700 hover:bg-sky-600 transition-all text-white font-semibold"
                    type="submit"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="w-full h-8 rounded-md bg-slate-600 hover:bg-slate-500 transition-all text-white font-semibold"
                  >
                    <Link to={{ pathname: `/` }}>Cancel</Link>
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
