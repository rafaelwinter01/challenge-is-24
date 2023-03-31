import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { ProductForm } from "./components/ProductForm";
import { ProductsTable } from "./components/ProductsTable";
import { ProductView } from "./components/ProductView";
import "./index.css";

function App() {
  return (
    <div className="h-full w-full overflow-x-hidden">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductsTable />} />
          <Route path="/product/:productId" element={<ProductView />} />
          <Route path="/productform/:productId" element={<ProductForm />} />
          <Route path="/productform/" element={<ProductForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
