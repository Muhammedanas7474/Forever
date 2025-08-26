import React from "react";
import Title from "../components/Title";
import { assets } from "../../public/Images/products/assets";

const About = () => {
  return (
    <div className="px-6 md:px-12">
      {/* ABOUT US */}
      <div className="text-3xl text-center pt-12 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      {/* About Section */}
      <div className="my-16 flex flex-col md:flex-row items-center justify-center gap-16 max-w-6xl mx-auto">
        <img
          className="w-full md:max-w-[450px] -xl shadow-md"
          src={assets.about_img}
          alt="About Us"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 text-center md:text-left">
          <p>
            <span className="font-semibold text-gray-800">Forever</span> was
            born out of a passion for innovation and a desire to revolutionize
            the shopping experience. We aim to bring customers closer to the
            products they love with style, convenience, and trust.
          </p>
          <p>
            Since our inception, we’ve worked tirelessly to curate a diverse
            selection of high-quality products that cater to different lifestyles
            and needs — from everyday essentials to timeless fashion pieces.
          </p>
          <b className="text-gray-800 text-lg">Our Mission</b>
          <p>
            To provide premium products at fair prices while ensuring an
            exceptional shopping journey. We strive to blend{" "}
            <span className="font-medium">quality, trust, and customer-first service</span>{" "}
            into every step of your experience with us.
          </p>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="text-2xl py-6 text-center">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20 gap-6 max-w-6xl mx-auto">
        <div className="border px-10 md:px-12 py-10 flex flex-col gap-4 rounded-xl shadow-sm text-center md:text-left">
          <b className="text-lg">Quality Assurance</b>
          <p className="text-gray-500">
            Every product is carefully inspected and sourced from trusted
            suppliers. Our commitment is to deliver only items that meet the
            highest standards of quality and durability.
          </p>
        </div>
        <div className="border px-10 md:px-12 py-10 flex flex-col gap-4 rounded-xl shadow-sm text-center md:text-left">
          <b className="text-lg">Convenience</b>
          <p className="text-gray-500">
            With a seamless online shopping experience, secure payment methods,
            and fast delivery options, shopping with us is simple and stress-free.
          </p>
        </div>
        <div className="border px-10 md:px-12 py-10 flex flex-col gap-4 rounded-xl shadow-sm text-center md:text-left">
          <b className="text-lg">Exceptional Service</b>
          <p className="text-gray-500">
            Our support team is always ready to help. From product inquiries to
            after-sales assistance, we put our customers first and ensure
            satisfaction every step of the way.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
