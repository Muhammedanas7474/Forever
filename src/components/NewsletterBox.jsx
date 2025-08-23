import React from 'react'

const NewsletterBox = () => {
    const onSubmitHandler=(e)=>{
        e.preventDefault();
    }
  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-grey-800'>Subscibe now & get 20% off</p>
      <p className='text-grey-400 mt-3'>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt repellat eos illum perspiciatis molestias provident atque facere tenetur sint corporis sequi optio, laboriosam eaque doloribus totam debitis ipsam at. Amet.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex item-center gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required/>
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
