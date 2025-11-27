import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ProductContext } from "../context/Productcontext";
import { CartContext } from "../context/Cartcontext";

import RelatedProducts from "../components/RelatedProducts";
import { assets } from "../../public/Images/products/assets";
import { toast } from "react-toastify";

const Products = () => {
  const { productId } = useParams();

  const { loadProductDetail, productDetail, detailLoading } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // ------------------------------------------------------
  // Load Product from Backend
  // ------------------------------------------------------
  useEffect(() => {
    loadProductDetail(productId);
  }, [productId]);

  // ------------------------------------------------------
  // Set Initial Image after loading product
  // ------------------------------------------------------
  useEffect(() => {
    if (productDetail && productDetail.images && productDetail.images.length > 0) {
      setImage(productDetail.images[0].url);
    }
  }, [productDetail]);

  // ------------------------------------------------------
  // Add to Cart Handler
  // ------------------------------------------------------
  const handleAddToCart = () => {
    if (!size) {
      toast.error("⚠️ Please select a size.");
      return;
    }
    addToCart(productDetail.id, size, 1);
  };

  // ------------------------------------------------------
  // Loading State
  // ------------------------------------------------------
  if (detailLoading || !productDetail) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  const product = productDetail;

  // ------------------------------------------------------
  // JSX
  // ------------------------------------------------------
  return (
    <div className="border-t pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ---------- LEFT SIDE (Images) ---------- */}
        <div className="flex-1 flex flex-col-reverse lg:flex-row gap-4">

          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:w-[20%]">
            {product.images?.map((img, i) => (
              <img
                key={i}
                onClick={() => setImage(img.url)}
                src={img.url}
                alt=""
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
                  image === img.url ? "border-black shadow-md" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full lg:w-[80%]">
            <img
              src={image}
              alt={product.name}
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* ---------- RIGHT SIDE (Info) ---------- */}
        <div className="flex-1 space-y-6">

          {/* Title + Rating */}
          <div>
            <h1 className="font-semibold text-2xl lg:text-3xl">
              {product.name}
            </h1>

            <div className="flex items-center gap-1 mt-2">
              <img src={assets.star_icon} className="w-4" />
              <img src={assets.star_icon} className="w-4" />
              <img src={assets.star_icon} className="w-4" />
              <img src={assets.star_icon} className="w-4" />
              <img src={assets.star_dull_icon} className="w-4" />
              <p className="text-sm text-gray-500 ml-1">(122 Reviews)</p>
            </div>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-gray-800">
            ${product.price}
          </p>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product.description || "No description available."}
          </p>

          {/* Sizes */}
          <div>
            <p className="font-medium mb-2">Select Size</p>
            <div className="flex gap-3 flex-wrap">
              {(product.sizes || ["S", "M", "L", "XL"]).map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    size === s
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 border-gray-300 hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="text-sm">
            <p
              className={`font-medium ${
                product.stock > 10
                  ? "text-green-500"
                  : product.stock > 0
                  ? "text-orange-500"
                  : "text-red-500"
              }`}
            >
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                ? `Only ${product.stock} left!`
                : "Out of Stock"}
            </p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full md:w-auto px-8 py-3 rounded-xl shadow-md transition ${
              product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Extra Info */}
          <div className="text-sm text-gray-500 border-t pt-4 space-y-1">
            <p>🔐 100% Secure Payment</p>
            <p>🚚 Cash On Delivery Available</p>
            <p>🔄 Easy Return within 7 Days</p>
          </div>
        </div>
      </div>

      {/* ---------- RELATED PRODUCTS ---------- */}
      <div className="mt-16">
        <RelatedProducts
          productId={product.id}
          category={product.category?.name}
        />
      </div>
    </div>
  );
};

export default Products;
