// components/HowToApply.tsx
import React, { useState } from 'react';
import { FileText, Send, Clock, CheckCircle, Upload, Printer, Phone, Mail, MapPin, Download } from 'lucide-react';
const HowToApply = () => {
  const [activeTab, setActiveTab] = useState('apply');

  const steps = [
    {
      id: 'apply',
      icon: FileText,
      title: 'Apply',
      description: 'Choose your preferred application method',
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <a href="signin" className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Upload className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Online Portal</p>
                <p className="text-sm text-gray-500">Apply instantly through our secure portal</p>
              </div>
            </a>
            <a href="tel:8553739994" className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Phone Application</p>
                <p className="text-sm text-gray-500">Call 314-000-0000</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Download className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">Download Application</p>
                <p className="text-sm text-gray-500">Print & fill out (English/Español)</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <MapPin className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">In Person</p>
                <p className="text-sm text-gray-500">Visit a Family Support Division Resource Center</p>
              </div>
            </a>
          </div>
        </div>
      ),
    },
    {
      id: 'complete',
      icon: FileText,
      title: 'Complete Form',
      description: 'Submit supplemental forms if applicable',
      content: (
        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-3">You must complete the Supplemental Form if you:</h4>
          <ul className="space-y-2">
            {['Are age 65 or older', 'Are blind or disabled', 'Get Social Security', 'Live in a medical or nursing facility', 'Have Medicare or VA healthcare'].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-amber-700">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button className="mt-4 text-amber-700 font-medium hover:text-amber-900 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Supplemental Form (English/Español)
          </button>
        </div>
      ),
    },
    {
      id: 'submit',
      icon: Send,
      title: 'Submit',
      description: 'Send your completed application',
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Upload className="h-5 w-5 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900">Online Upload</p>
              <p className="text-sm text-gray-500 mb-2">Upload your documents securely</p>
              <a href="/signin" className="text-blue-600 text-sm hover:underline break-all">MO Health Net</a>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900">By Mail</p>
              <p className="text-sm text-gray-500">Family Support Division</p>
              <p className="text-sm text-gray-500">P.O. Box 2700</p>
              <p className="text-sm text-gray-500">Jefferson City, MO 65102</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Printer className="h-5 w-5 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900">By Fax</p>
              <p className="text-sm text-gray-500">Send documents to</p>
              <p className="text-lg font-bold text-blue-600">314-000-0000</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900">In Person</p>
              <p className="text-sm text-gray-500">Visit your local</p>
              <p className="text-sm font-medium text-gray-700">Family Support Division Resource Center</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps.find(step => step.id === activeTab) || steps[0];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How do I apply?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Apply for healthcare coverage by completing these simple steps
          </p>
        </div>

        {/* Step Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveTab(step.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === step.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeTab === step.id ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
              }`}>
                {idx + 1}
              </span>
              {step.title}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <currentStep.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{currentStep.title}</h3>
              <p className="text-gray-500">{currentStep.description}</p>
            </div>
          </div>
          {currentStep.content}
        </div>

        {/* Timeline Info */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Clock className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">When will I get coverage?</h3>
              <p className="text-gray-700 mb-3">
                Once your application is processed, you will get a letter letting you know if you are eligible. 
                If approved, you will receive a MO HealthNet Identification Card with information about your coverage.
              </p>
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Processing time:</span> If you don't receive anything after 45 days, 
                  please contact the Family Support Division. Disability determinations may take longer than usual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToApply;