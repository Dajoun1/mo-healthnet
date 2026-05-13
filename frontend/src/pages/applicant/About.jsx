import {
  Info,
  Heart,
  Users,
  FileText,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Building2,
  ShieldCheck,
  ClipboardCheck,
  Stethoscope,
  Pill,
  Ambulance,
  Hospital,
  Baby,
  UserCog
} from 'lucide-react';

const About = () => {

  const coverageTypes = [
    {
      icon: Stethoscope,
      title: 'Doctor Visits',
      description: 'Primary care, specialists, and preventive care',
      color: 'text-blue-600'
    },
    {
      icon: Pill,
      title: 'Prescriptions',
      description: 'Prescription medications and pharmacy benefits',
      color: 'text-green-600'
    },
    {
      icon: Hospital,
      title: 'Hospital Care',
      description: 'Inpatient and outpatient hospital services',
      color: 'text-red-600'
    },
    {
      icon: Ambulance,
      title: 'Emergency Services',
      description: 'Emergency room visits and ambulance transport',
      color: 'text-orange-600'
    },
    {
      icon: Baby,
      title: 'Maternal & Child',
      description: 'Prenatal care, delivery, and pediatric services',
      color: 'text-pink-600'
    },
    {
      icon: UserCog,
      title: 'Mental Health',
      description: 'Behavioral health and substance abuse treatment',
      color: 'text-purple-600'
    }
  ];

  const programBenefits = [
    'Comprehensive medical coverage at low or no cost',
    'Access to quality healthcare providers across Missouri',
    'Prescription drug coverage',
    'Preventive care services at no cost',
    'Emergency and hospital services',
    'Mental health and substance abuse treatment',
    'Vision and dental services for children',
    'Home health and long-term care services'
  ];

  const eligibilityFactors = [
    {
      icon: Users,
      title: 'Family Size',
      description: 'Number of people in your household affects eligibility'
    },
    {
      icon: DollarSign,
      title: 'Income Level',
      description: 'Monthly or annual household income must meet guidelines'
    },
    {
      icon: FileText,
      title: 'Citizenship',
      description: 'U.S. citizen or qualified non-citizen with documentation'
    },
    {
      icon: Building2,
      title: 'Missouri Residency',
      description: 'Must be a resident of Missouri'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - More Compact */}
      <div className="bg-[#0078AE] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Info className="h-8 w-8" />
            <h1 className="text-3xl font-bold">About MO HealthNet</h1>
          </div>
          <p className="text-base text-white/90 max-w-4xl">
            MO HealthNet is Missouri's Medicaid program, providing comprehensive healthcare coverage to eligible
            low-income adults, children, pregnant women, elderly adults, and people with disabilities. Our mission
            is to ensure access to quality healthcare services for all eligible Missouri residents.
          </p>
        </div>
      </div>

      {/* What is MO HealthNet Section - Compact */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is MO HealthNet?</h2>
              <p className="text-gray-700 mb-4">
                MO HealthNet is the state of Missouri's Medicaid program, funded jointly by the federal and
                state governments. It provides health insurance coverage to eligible Missouri residents who
                meet specific income and other requirements.
              </p>
              <p className="text-gray-700 mb-4">
                The program serves over <strong>1 million Missourians</strong>, including children, pregnant
                women, parents and caretaker relatives, seniors, and individuals with disabilities.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Important:</strong> MO HealthNet is not the same as health insurance you buy from
                  a private company. It's a government program designed to help low-income individuals and
                  families afford healthcare.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Qualifies?</h2>
              <div className="space-y-3">
                {eligibilityFactors.map((factor, idx) => (
                  <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <factor.icon className="h-5 w-5 text-[#0078AE]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{factor.title}</h3>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Covered Section - More Information Dense */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Services Are Covered?</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {coverageTypes.map((coverage, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <coverage.icon className={`h-8 w-8 ${coverage.color} mb-2`} />
                <h3 className="font-semibold text-gray-900 mb-1">{coverage.title}</h3>
                <p className="text-sm text-gray-600">{coverage.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Additional Benefits Included:
            </h3>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
              {programBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Income Guidelines Section - New */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Income Guidelines</h2>
          <p className="text-gray-700 mb-6">
            Eligibility is primarily based on your household size and monthly income. The table below shows
            approximate monthly income limits for 2026:
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Household Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Monthly Income Limit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Annual Income Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-3 text-sm text-gray-900">1 person</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$1,732</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$20,783</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-gray-900">2 people</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$2,352</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$28,207</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-gray-900">3 people</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$2,972</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$35,632</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-gray-900">4 people</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$3,592</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$43,056</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm text-gray-900">5 people</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$4,212</td>
                  <td className="px-6 py-3 text-sm text-gray-700">$50,481</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            * Income limits vary by coverage category. Add approximately $620/month for each additional
            household member. These are approximate guidelines; actual eligibility depends on multiple factors.
          </p>
        </div>
      </section>

      {/* Application Process - Brief Overview */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Apply</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Gather Documents</h3>
              <p className="text-sm text-gray-600">ID, proof of income, residence, and citizenship</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Submit Application</h3>
              <p className="text-sm text-gray-600">Online, by phone, mail, or in person</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Review Period</h3>
              <p className="text-sm text-gray-600">Usually 30-45 days for processing</p>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Get Coverage</h3>
              <p className="text-sm text-gray-600">Receive your MO HealthNet ID card</p>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents - New Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Documents</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-5 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-[#0078AE] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Identity & Citizenship</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Driver's license or state ID</li>
                <li>• Birth certificate</li>
                <li>• Social Security card</li>
                <li>• Passport or naturalization papers</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <DollarSign className="h-6 w-6 text-[#0078AE] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Income Verification</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Recent pay stubs</li>
                <li>• Tax returns</li>
                <li>• Bank statements</li>
                <li>• Unemployment documentation</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <Building2 className="h-6 w-6 text-[#0078AE] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Residency Proof</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Utility bills</li>
                <li>• Lease or mortgage documents</li>
                <li>• Mail with your address</li>
                <li>• School enrollment records</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information - New */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-5">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Annual Renewals Required
              </h3>
              <p className="text-sm text-amber-800">
                You must renew your MO HealthNet coverage every year. You'll receive a renewal packet
                in the mail. Complete and return it on time to avoid losing coverage.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Report Changes Promptly
              </h3>
              <p className="text-sm text-blue-800">
                Report changes in income, household size, address, or employment within 10 days.
                Changes may affect your eligibility or benefit amount.
              </p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-5">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                No Application Fee
              </h3>
              <p className="text-sm text-green-800">
                Applying for MO HealthNet is completely free. There is no application fee, and you
                will not be charged for submitting your application.
              </p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-5">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Emergency Coverage Available
              </h3>
              <p className="text-sm text-purple-800">
                Emergency Medicaid may be available for non-citizens in emergency situations.
                Contact the Family Support Division for more information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Compact */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get Help</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <Phone className="h-6 w-6 text-[#0078AE] mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <p className="text-sm text-gray-600 mb-1">1-800-MO-HEALTH</p>
              <p className="text-xs text-gray-500">Mon-Fri 8am-5pm CST</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <Mail className="h-6 w-6 text-[#0078AE] mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-sm text-gray-600 mb-1">support@mohealthnet.gov</p>
              <p className="text-xs text-gray-500">Response in 24-48 hours</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <MapPin className="h-6 w-6 text-[#0078AE] mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">In Person</h3>
              <p className="text-sm text-gray-600 mb-1">Resource Centers</p>
              <p className="text-xs text-gray-500">Find a location near you</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;