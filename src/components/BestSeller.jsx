import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/Productcontext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ProductContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      // Example: Pick the first 5 as best sellers
      const bestProducts = products.slice(0, 5);
      setBestSeller(bestProducts);
    }
  }, [products]);

  return (
    <div className='my-10 px-5'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-grey-600'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi et
          distinctio doloribus temporibus beatae!
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item.id}
            name={item.name}
            image={item.images?.[0]}  // Use first image
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
