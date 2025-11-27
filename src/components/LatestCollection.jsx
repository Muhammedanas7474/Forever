import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/Productcontext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ProductContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            // Sort by created_at (newest first)
            const sortedProducts = [...products].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );

            setLatestProducts(sortedProducts.slice(0, 10)); // latest 10 items
        }
    }, [products]);

    return (
        <div className="my-10 px-5">
            <div className="text-center py-8 text-3xl">
                <Title text1={"LATEST"} text2={"COLLECTION"} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </p>
            </div>

            {/* Render Latest Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {latestProducts.map((item) => (
                    <ProductItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        image={item.images?.[0]} // first image
                    />
                ))}
            </div>
        </div>
    );
};

export default LatestCollection;
