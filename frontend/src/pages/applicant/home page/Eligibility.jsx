// components/Eligibility.tsx
import React from 'react';
import { Users, Baby, PersonStanding, Heart, Eye, Briefcase, Flower2, Stethoscope } from 'lucide-react';

const eligibilityCategories = [
  { icon: Users, title: 'Seniors', description: 'Age 65 and older', color: 'bg-blue-100 text-blue-600' },
  { icon: Baby, title: 'Children', description: 'Age birth - 18', color: 'bg-green-100 text-green-600' },
  { icon: PersonStanding, title: 'Parents/Caretakers', description: 'With child under age 19', color: 'bg-purple-100 text-purple-600' },
  { icon: Heart, title: 'Pregnant Women', description: 'Including unborn child', color: 'bg-pink-100 text-pink-600' },
  { icon: Stethoscope, title: 'Adults', description: 'Age 19-64 without disabilities', color: 'bg-orange-100 text-orange-600' },
  { icon: Flower2, title: 'Women', description: 'Age 18-55, no insurance', color: 'bg-red-100 text-red-600' },
  { icon: Eye, title: 'Blind/Visually Impaired', description: 'Adults with visual impairment', color: 'bg-indigo-100 text-indigo-600' },
  { icon: Briefcase, title: 'Persons with Disabilities', description: 'Of any age', color: 'bg-gray-100 text-gray-600' },
];

const Eligibility = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who is eligible?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Eligibility for MO HealthNet depends on your <span className="font-semibold">income</span>, <span className="font-semibold">age</span>, <span className="font-semibold">health</span>, and individual needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eligibilityCategories.map((category, index) => (
            <div
              key={index}
              className="group bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.title}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            * Additional eligibility criteria may apply based on income and other factors.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Eligibility;