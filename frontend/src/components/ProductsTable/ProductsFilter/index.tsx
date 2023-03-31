import { useState } from "react";
import { Link } from "react-router-dom";
import { IProductQuery } from "../../../types";

interface IProductFilterProps {
  setFilter: (filter: IProductQuery) => any;
}

export function ProductsFilter({ setFilter }: IProductFilterProps) {
  const [filterValues, setFilterValues] = useState<IProductQuery>({
    developer: "",
    scrumMasterName: "",
  });

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    /* @ts-ignore */
    setFilterValues({
      ...filterValues,
      [event.target.name]: event.target.value,
    });
  }

  function handleClickFilter() {
    setFilter(filterValues);
  }

  return (
    <>
      <div className="flex items-center justify-end p-2 h-12 bg-slate-200">
        Filter by:
      </div>
      <div className="h-12 bg-slate-200"></div>
      <div className="h-12 bg-slate-200"></div>
      <div className="flex justify-center items-center p-1 h-12 bg-slate-200">
        <input
          className="border-2 border-slate-400 px-1 max-w-full"
          type="text"
          name="developer"
          value={filterValues.developer}
          onChange={handleFilterChange}
        />
      </div>
      <div className="flex justify-center items-center p-1 h-12 bg-slate-200">
        <input
          className="border-2 border-slate-400 px-1 max-w-full"
          type="text"
          name="scrumMasterName"
          value={filterValues.scrumMasterName}
          onChange={handleFilterChange}
        />
      </div>
      <div className="h-12 bg-slate-200"></div>
      <div className="h-12 bg-slate-200"></div>
      <div className="flex justify-center h-12 bg-slate-200 p-2">
        <button
          className="w-full rounded-md bg-sky-700 hover:bg-sky-600 transition-all text-white font-semibold"
          type="button"
          onClick={handleClickFilter}
        >
          Apply Filter
        </button>
      </div>
    </>
  );
}
