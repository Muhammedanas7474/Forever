import React from 'react'
import { assets } from '../../public/Images/products/assets'
// import { assets } from '../assets/frontend_assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.logo} className='mb-5 w-32' alt="" />
                <p className='w-full md:w-2/3 text-grey-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias distinctio nihil, neque illo debitis vero totam et iusto sequi porro corporis? Debitis eligendi quas perferendis tenetur? Eligendi consectetur odit reprehenderit!
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPONY</p>
                <ul className='flex flex-col gap-1 text-grey-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li> PrivacycPolicy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET OIN TOUCH</p>
                <ul className='flex flex-col gap-1 text-grey-600'>
                    <li>+91-9744247474</li>
                    <li>muhammedanas247474@gmail.com</li>
                </ul>
        
            </div>

      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
            Copyright 2025@ forever.com- All Right Rserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
