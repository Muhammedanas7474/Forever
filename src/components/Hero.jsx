import React, { useState, useEffect } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      id: 1,
      title: "Latest Arrival",
      subtitle: "OUR BEST SELLER",
      image:"/Images/products/hero_img.png" ,
      buttonText: "SHOP NOW"
    },
    {
      id: 2,
      title: "Premium Collection",
      subtitle: "LUXURY SELECTION",
      image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      buttonText: "EXPLORE"
    },
    {
      id: 3,
      title: "Summer Edition",
      subtitle: "SEASONAL FAVORITES",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
      buttonText: "DISCOVER"
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden border border-gray-200 z-0 ">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col sm:flex-row ${
            index === currentSlide
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-full'
          }`}
        >
          {/* Left side - Text content */}
          <div className='w-full sm:w-1/2 flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 p-8'>
            <div className='text-[#414141] max-w-md'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='w-8 md:w-11 h-[2px] bg-[#414141]'></span>
                <p className='font-medium text-sm md:text-base tracking-widest'>
                  {slide.subtitle}
                </p>
              </div>
              <h1 className='prata-regular text-4xl md:text-5xl lg:text-6xl leading-tight mb-6'>
                {slide.title}
              </h1>
              <div className='flex items-center gap-2 group cursor-pointer'>
                <p className='font-semibold text-sm md:text-base tracking-wider group-hover:underline'>
                  {slide.buttonText}
                </p>
                <span className='w-8 md:w-11 h-[2px] bg-[#414141] transition-all duration-300 group-hover:w-16'></span>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className='w-full sm:w-1/2 h-full'>
            <img 
              className="w-full h-full object-cover object-center" 
              src={slide.image} 
              alt={slide.title} 
            />
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md transition-all duration-300 z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md transition-all duration-300 z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#414141] scale-125"
                : "bg-white bg-opacity-80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;