import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/Productcontext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, loading, error } = useContext(ProductContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubcategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const [search, setSearch] = useState("");      // Added: for searching
  const [enableSearch, setEnableSearch] = useState(false); // toggle

  // CATEGORY FILTER HANDLER
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // SUB CATEGORY FILTER HANDLER
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubcategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubcategory((prev) => [...prev, e.target.value]);
    }
  };

  // APPLY FILTERS
  const applyFilter = () => {
    let data = [...products];

    // Search filter
    if (enableSearch && search) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category.length > 0) {
      data = data.filter((item) => category.includes(item.category?.name));
    }

    // Subcategory filter
    if (subCategory.length > 0) {
      data = data.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(data);
  };

  // SORT FILTERED PRODUCTS
  const sortProducts = () => {
    let sorted = [...filterProducts];

    if (sortType === "low-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      applyFilter(); // relevant = reset
      return;
    }

    setFilterProducts(sorted);
  };

  // INITIAL LOAD
  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  // APPLY FILTER WHEN FILTER STATE CHANGES
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, enableSearch, products]);

  // SORT WHEN CHANGED
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  // LOADING & ERROR STATES
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-10 border-t border-gray-200 px-5">

      {/* ============================ LEFT FILTER ============================ */}
      <div className="w-full sm:w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="text-lg font-semibold flex items-center justify-between sm:justify-start cursor-pointer gap-2 text-gray-800"
        >
          Filters
          <span className="sm:hidden text-sm text-gray-500">
            {showFilter ? "Hide" : "Show"}
          </span>
        </p>

        {/* CATEGORY FILTER */}
        <div
          className={`mt-6 border border-gray-200 rounded-lg bg-white shadow-sm ${
            showFilter ? "block" : "hidden sm:block"
          }`}
        >
          <div className="p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">CATEGORIES</p>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {["Men", "Women", "Kids"].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    className="w-4 h-4 accent-indigo-600"
                    type="checkbox"
                    value={cat}
                    onChange={toggleCategory}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SUB CATEGORY FILTER */}
        <div
          className={`mt-6 border border-gray-200 rounded-lg bg-white shadow-sm ${
            showFilter ? "block" : "hidden sm:block"
          }`}
        >
          <div className="p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">TYPE</p>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
                <label key={sub} className="flex items-center gap-2 cursor-pointer">
                  <input
                    className="w-4 h-4 accent-indigo-600"
                    type="checkbox"
                    value={sub}
                    onChange={toggleSubCategory}
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================ RIGHT SIDE ============================ */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTION"} />

          {/* SORT DROPDOWN */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by Relevant</option>
            <option value="low-high">Sort by Low to High</option>
            <option value="high-low">Sort by High to Low</option>
          </select>
        </div>

        {/* SEARCH BAR (OPTIONAL) */}
        <div className="mb-3">
          <input
            type="text"
            className="border px-3 py-2 w-full text-sm rounded"
            placeholder="Search products..."
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setEnableSearch(true)}
          />
        </div>

        {/* COUNT LABEL */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filterProducts.length} of {products.length} products
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item) => (
              <ProductItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.images}   // updated
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
