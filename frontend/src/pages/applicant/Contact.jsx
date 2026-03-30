import React from "react";
import MapImg from "../../assets/images/mapImage.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function Contact() {
  return (
    <div className="flex flex-col text-start justify-center h-auto gap-8 px-4 sm:px-6 lg:px-20 py-16 mb-10 border border-stone-200">
      {/* Header */}
      <div>
        <div className="text-3xl md:text-4xl font-bold text-gray-900">Get in Touch</div>
        <p className="text-gray-600 text-lg mt-3 max-w-2xl">
          We're here to answer your questions and guide you.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Contact Information */}
        <div className="lg:w-1/2 space-y-8">
          {/* Email */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-blue-600 mt-1" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Email</div>
              <p className="text-gray-600 text-sm mt-0.5">Send us a message</p>
              <a 
                href="mailto:youremail@example.com" 
                className="text-blue-600 hover:text-blue-700 text-sm block mt-2"
              >
                youremail@example.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-blue-600 mt-1" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Phone</div>
              <p className="text-gray-600 text-sm mt-0.5">Call us during business hours</p>
              <a 
                href="tel:+11234567890" 
                className="text-blue-600 hover:text-blue-700 text-sm block mt-2"
              >
                +1 (123) 456-7890
              </a>
            </div>
          </div>

          {/* Office */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faLocationDot} className="w-5 h-5 text-blue-600 mt-1" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Office</div>
              <p className="text-gray-600 text-sm mt-0.5">Visit our office</p>
              <address className="text-gray-600 text-sm not-italic mt-2">
                123 Main Street<br />
                City, State 12345
              </address>
            </div>
          </div>
        </div>

        {/* Map Image */}
        <div className="lg:w-1/2 h-[300px] md:h-[400px]  overflow-hidden">
          <img
            src={MapImg}
            alt="Office location map"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Business Hours */}
      <div className="mt-8 pt-6 border-t border-stone-200">
        <p className="text-gray-500 text-sm">
          Business Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
        </p>
      </div>
    </div>
  );
}