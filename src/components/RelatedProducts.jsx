import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/Productcontext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ productId, category }) => {
  const { loadRelatedProducts } = useContext(ProductContext);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // Fetch related products from backend
  // /products/<id>/related/
  // -----------------------------------------
  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      const data = await loadRelatedProducts(productId);
      setRelated(data);
      setLoading(false);
    };

    fetchRelated();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading related products...
      </div>
    );
  }

  if (related.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No related products found.
      </div>
    );
  }

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.images}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
