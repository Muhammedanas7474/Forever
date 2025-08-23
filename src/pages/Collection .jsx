import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products,search,ShowSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const[filterProducts,setFilterProducts]=useState([])
  const[category,setCategory]=useState([])
  const [subCategory,setSubcategory]=useState([]);
  const [sortType,setSortType]=useState('relavent')

  const toggleCategory=(e)=>{

    if(category.includes(e.target.value)){
      setCategory(prev=> prev.filter(item=> item!==e.target.value))
    }else{
      setCategory(prev=>[...prev,e.target.value])
    }
  }

  const toggleSubCategory=(e)=>{
    if(subCategory.includes(e.target.value)){
      setSubcategory(prev=>prev.filter(item=> item!==e.target.value))
    }else{
      setSubcategory(prev=>[...prev,e.target.value])
    }
  }

  const applyFilter = ()=>{
    let productsCopy=products.slice();

    if(ShowSearch && search){
      productsCopy=productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if(category.length>0){
      productsCopy=productsCopy.filter(item => category.includes(item.category));
    }

    if(subCategory.length>0){
      productsCopy= productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)
  }

  const sortProducts=()=>{
    let fpCopy= filterProducts.slice();

    switch(sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=> (a.price - b.price)));
        break;

      case 'high-low':
      setFilterProducts(fpCopy.sort((a,b)=> (b.price - a.price)));
      break;

      default:
        applyFilter();
        break;
    }
  }


  useEffect(()=>{
    setFilterProducts(products);
  },[products])

  useEffect(()=>{
    applyFilter();
  },[category,subCategory,search,ShowSearch])

  useEffect(()=>{
    sortProducts();
  },[sortType])



  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-10 border-t border-gray-200 px-5">
      {/* Sidebar Filters */}
      <div className="w-full sm:w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="text-lg font-semibold flex items-center justify-between sm:justify-start cursor-pointer gap-2 text-gray-800"
        >
          Filters 
          <span className="sm:hidden text-sm text-gray-500">
            {showFilter ? 'Hide' : 'Show'}
          </span>
        </p>

        {/* Category Filter */}
        <div
          className={`mt-6 border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-200 ${
            showFilter ? 'block' : 'hidden sm:block'
          }`}
        >
          <div className="p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-normal text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="w-4 h-4 accent-indigo-600" type="checkbox" value="Men" onChange={toggleCategory} />
                Men
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="w-4 h-4 accent-indigo-600" type="checkbox" value="Women" onChange={toggleCategory} />
                Women
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="w-4 h-4 accent-indigo-600" type="checkbox" value="Kids" onChange={toggleCategory} />
                Kids
              </label>
            </div>
          </div>
        </div>

        {/* Sub Category Filter */}
        <div
          className={`mt-6 border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-200 ${
            showFilter ? 'block' : 'hidden sm:block'
          }`}
        >
          <div className="p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-normal text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="w-4 h-4 accent-indigo-600" type="checkbox" value="Topwear" onChange={toggleSubCategory} />
                Topwear
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="w-4 h-4 accent-indigo-600" type="checkbox" value="Bottomwear" onChange={toggleSubCategory} />
                Bottomwear
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="w-4 h-4 accent-indigo-600" type="checkbox" value="Winterwear" onChange={toggleSubCategory} />
                Winterwear
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1">

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTION'}/>
            {/*Product Sort */}
            <select onChange={(e)=>setSortType(e.target.value)} className='border-gray-300 text-sm px-2'>
              <option value="relavent">Sort by Relavent</option>
              <option value="low-high">Sort by Low to HIgh</option>
              <option value="high-low">Sort by High to Low</option>
            </select>
        </div>
        {/*  Map Products*/}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {filterProducts.map((item,index)=>(
              <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
            ))}
        </div>
         
      </div>
    </div>
  )
}

export default Collection
