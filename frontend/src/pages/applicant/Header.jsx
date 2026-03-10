import React from "react";
import { useNavigate } from "react-router-dom";
import headerImage from "../../assets/./images/header3.jpg";

export default function Header() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#ffffff] flex flex-col items-center text-center mt-20 px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 md:py-16">
      <div className="font-inter flex flex-col gap-1 sm:gap-2 text-2xl sm:text-4xl md:text-3xl lg:text-4xl">
        <span>Healthcare coverage for</span>
        <span>Missouri families</span>
      </div>
      <p className="font-inter text-sm sm:text-base md:text-lg text-stone-900 my-4 sm:my-6 md:my-8 max-w-2xl mx-auto">
        Start your application in minutes. Save your progress anytime. Get your
        eligibility results fast.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto mb-10">
        <button className="bg-[#0B64A4] text-white py-2 px-6 sm:px-8 rounded hover:bg-[#005a80] transition-colors duration-200 w-full sm:w-auto">
          Apply
        </button>
        <button onClick={() => navigate("/signin")} className="text-stone-900 font-semibold py-2 px-6 sm:px-8 rounded border border-stone-400 hover:border-[#0B64A4] hover:text-[#0B64A4] transition-colors duration-200 w-full sm:w-auto">
          Sign in
        </button>
      </div>
      <div className="mt-10 sm:mt-8 md:mt-12 w-full max-w-7xl mx-auto">
        <img src={headerImage} alt="Hero" className="w-full h-auto" />
      </div>
    </section>
  );
}
