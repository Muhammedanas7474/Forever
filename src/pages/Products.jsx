import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { assets } from "../../public/Images/products/assets";
import { toast } from "react-toastify";

const Products = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  // ✅ Handle Add to Cart with Toast
  const handleAddToCart = () => {
    if (!size) {
      toast.error("⚠️ Please select a size before adding to cart!");
      return;
    }
    addToCart(productData._id, size);
    toast.success("✅ Added to cart successfully!");
  };

  return productData ? (
    <div className="border-t pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Section */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:w-[18%]">
            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                alt=""
                className={`w-20 h-20 object-cover rounded-lg border cursor-pointer ${
                  image === item ? "border-black shadow-md" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full lg:w-[80%]">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="font-semibold text-2xl lg:text-3xl">
              {productData.name}
            </h1>
            <div className="flex items-center gap-1 mt-2">
              <img src={assets.star_icon} alt="" className="w-4" />
              <img src={assets.star_icon} alt="" className="w-4" />
              <img src={assets.star_icon} alt="" className="w-4" />
              <img src={assets.star_icon} alt="" className="w-4" />
              <img src={assets.star_dull_icon} alt="" className="w-4" />
              <p className="text-sm text-gray-500 ml-1">(122 Reviews)</p>
            </div>
          </div>

          <p className="text-3xl font-bold text-gray-800">
            {currency}
            {productData.price}
          </p>

          <p className="text-gray-600 leading-relaxed">
            {productData.description}
          </p>

          {/* Sizes */}
          <div>
            <p className="font-medium mb-2">Select Size</p>
            <div className="flex gap-3">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    size === item
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 border-gray-300 hover:border-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white w-full md:w-auto px-8 py-3 rounded-xl shadow-md hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>

          {/* Extra Info */}
          <div className="text-sm text-gray-500 border-t pt-4 space-y-1">
            <p>✅ 100% Original Product.</p>
            <p>🚚 Cash On Delivery Available.</p>
            <p>🔄 Easy Return & Exchange within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Products;
