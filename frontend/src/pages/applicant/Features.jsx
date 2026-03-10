import React from "react";
import Card1 from "../../assets/images/card1.jpg";
import Card2 from "../../assets/images/card2.jpg";
import Card3 from "../../assets/images/card3.jpg";
import Arrow from "../../assets/icons/arrow.png";
import Feature1 from "../../assets/images/feature1.jpg";
import Feature2 from "../../assets/images/feature2.jpg";
import Feature3 from "../../assets/images/feature3.jpg";

export default function Features() {
  return (
    <div>
      {/* Features Section */}
      <section className="bg-white px-4 sm:px-6 lg:px-16 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-sm font-semibold mb-2">Features</div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Everything you need
            </div>
            <div className="text-gray-600 max-w-2xl mx-auto">
              Complete your application with confidence and ease.
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Two Cards */}
            <div className="flex-1 flex flex-col gap-6">
              {/* First Card */}
              <div className="flex flex-col md:flex-row overflow-hidden  bg-white border border-stone-200">
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center ">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Create your
                    <br />
                    secure account
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Register with your email address to create a secure, private
                    account. Your information is protected.
                  </p>
                  <button className="flex items-center font-semibold cursor-pointer group">
                    Learn more
                    <img
                      src={Arrow}
                      alt="Arrow"
                      className="w-4 h-4 ml-2 mt-1 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
                <div className="md:w-64 lg:w-80 h-64 md:h-auto">
                  <img
                    src={Feature1}
                    alt="Secure account"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Second Card */}
              <div className="flex flex-col md:flex-row overflow-hidden bg-white border border-stone-200 ">
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center ">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Who Qualifies
                    <br />
                    for Coverage
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Medicaid provides health coverage to eligible low-income
                    adults, children, pregnant women, elderly adults, and people
                    with disabilities.
                  </p>
                  <button className="flex items-center font-semibold cursor-pointer group">
                    Learn more
                    <img
                      src={Arrow}
                      alt="Arrow"
                      className="w-4 h-4 ml-2 mt-1 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
                <div className="md:w-64 lg:w-80 h-64 md:h-auto">
                  <img
                    src={Feature2}
                    alt="Who qualifies"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Third Card */}
            <div className="lg:w-96 flex flex-col overflow-hidden border border-stone-200 bg-white">
              <div className="p-6 md:p-8 flex flex-col justify-center ">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Save <br />& Continue Anytime
                </h3>
                <p className="text-gray-600 mb-6">
                  Begin your application and save your progress as you go. You
                  can return anytime to complete it-your information will be
                  waiting for you.
                </p>
                <button className="flex items-center font-semibold cursor-pointer group">
                  Arrow
                  <img
                    src={Arrow}
                    alt="Arrow"
                    className="w-4 h-4 ml-2 mt-1 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
              <div className="h-64 mt-auto">
                <img
                  src={Feature3}
                  alt="Document upload"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-16 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-sm font-semibold mb-2">Process</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              How it works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Three simple steps to complete your application.
            </p>
          </div>

          {/* Process Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white overflow-hidden border border-stone-200">
              <div className="h-56 overflow-hidden">
                <img
                  src={Card1}
                  alt="Start application"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="text-sm font-bold mb-3">
                  First
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                  Start your
                  <br />
                  application
                </h3>
                <p className="text-gray-600 mb-6">
                  Create an account and begin filling out your application.
                </p>
                <button className="flex items-center font-semibold cursor-pointer group">
                  Start
                  <img
                    src={Arrow}
                    alt="Arrow"
                    className="w-4 h-4 ml-2 mt-1 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white   overflow-hidden border border-stone-200">
              <div className="h-56 overflow-hidden">
                <img
                  src={Card2}
                  alt="Enter details"
                  className="w-full h-full object-cover "
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="text-sm font-bold mb-3">
                  Second
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                  Enter your
                  <br />
                  details
                </h3>
                <p className="text-gray-600 mb-6">
                  Provide residency, employment, and contact information for
                  review.
                </p>
                <button className="flex items-center font-semibold cursor-pointer group">
                  Continue
                  <img
                    src={Arrow}
                    alt="Arrow"
                    className="w-4 h-4 ml-2 mt-1 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white   overflow-hidden border border-stone-200">
              <div className="h-56 overflow-hidden">
                <img
                  src={Card3}
                  alt="Submit and check"
                  className="w-full h-full object-cover "
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="text-sm font-bold mb-3">
                  Third
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                  Submit and
                  <br />
                  check results
                </h3>
                <p className="text-gray-600 mb-6">
                  Submit your application and view your eligibility
                  determination.
                </p>
                <button className="flex items-center font-semibold cursor-pointer group">
                  Submit
                  <img
                    src={Arrow}
                    alt="Arrow"
                    className="w-4 h-4 ml-2 mt-1 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
