// components/Hero.tsx
import React from "react";
import { useState, useEffect } from "react";
import {
  Mail,
  FileText,
  ExternalLink,
  LogIn,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const sliderImages = [
  {
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=500&fit=crop",
    title: "Quality Healthcare for All Missourians",
    description: "Comprehensive coverage for you and your family",
  },
  {
    url: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&h=500&fit=crop",
    title: "Mental Health Services Included",
    description: "We care about your complete wellbeing",
  },
  {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=500&fit=crop",
    title: "Prescription Drug Coverage",
    description: "Affordable medications when you need them",
  },
  {
    url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&h=500&fit=crop",
    title: "Doctor Visits & Hospital Stays",
    description: "Access to quality medical care across Missouri",
  },
];

const Hero = () => {
    const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-white overflow-hidden pt-7">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
        <div className="text-center max-w-3xl mx-auto">
          <div className="font-inter flex flex-col gap-1 sm:gap-2 text-xl sm:text-4xl md:text-3xl lg:text-4xl">
            <span>Healthcare Coverage For</span>
            <span>Missouri Families</span>
          </div>
          <p className="text-md text-gray-600 mb-6 mt-3">
            MO HealthNet covers doctor visits, hospital stays, prescriptions,
            mental health services, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button onClick={() => navigate("/signin")} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Apply for Coverage
            </button>
            <a
              href="https://mydss.mo.gov/mhd"
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Image Slider */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12 max-w-5xl mx-auto">
            <div className="relative h-64 md:h-96">
              {sliderImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl md:text-2xl font-bold mb-1">
                      {image.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/90">
                      {image.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? "bg-white w-4" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
