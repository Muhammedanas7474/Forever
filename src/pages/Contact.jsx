import React from 'react'
import Title from '../components/Title'
import { assets } from '../../public/Images/products/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={"CONTACT"} text2={"US"}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'> 
        <img src={assets.contact_img} className='w-ful md:max-w-[480px]' alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className=' font-semibold text-gray-600'>Our Store</p>
          <p className='text-gray-500'>Calicut Town <br />Street 5005,Calicut,kerala</p>
          <p className='text-gray-500'>Tel:9744247474 <br/> Email:forever@gmail.com</p>
          <p className='font-semibold text-xl'>Careers at forever</p>
          <p className='text-gray-500'>Lear more about our teams and job openings.</p>
          <button className='border border-black px-8 py-text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
          <p className='text-gray-500'></p>
        </div>
      </div>
    </div>
  )
}

export default Contact
