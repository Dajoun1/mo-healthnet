import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const Support = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: "issue",
    subject: "",
    message: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    {
      value: "issue",
      label: "Report an Issue",
      icon: ExclamationTriangleIcon,
      color: "text-red-500",
      bgColor: "bg-red-50",
      description: "Something isn't working correctly",
    },
    {
      value: "question",
      label: "Ask a Question",
      icon: ChatBubbleLeftRightIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "Need help understanding something",
    },
    {
      value: "feedback",
      label: "Share Feedback",
      icon: LightBulbIcon,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Suggestions for improvement",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Log to terminal (non-functional)
    console.log("═══════════════════════════════════════════════════");
    console.log("📧 NEW SUPPORT REQUEST");
    console.log("═══════════════════════════════════════════════════");
    console.log("User:", user?.firstName, user?.lastName);
    console.log("Email:", user?.username);
    console.log("User ID:", user?.id);
    console.log("───────────────────────────────────────────────────");
    console.log("Category:", formData.category.toUpperCase());
    console.log("Priority:", formData.priority.toUpperCase());
    console.log("Subject:", formData.subject);
    console.log("───────────────────────────────────────────────────");
    console.log("Message:");
    console.log(formData.message);
    console.log("═══════════════════════════════════════════════════");
    console.log("Timestamp:", new Date().toISOString());
    console.log("═══════════════════════════════════════════════════");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Reset form
      setFormData({
        category: "issue",
        subject: "",
        message: "",
        priority: "medium",
      });
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const selectedCategory = categories.find((cat) => cat.value === formData.category);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="mt-2 text-gray-600">
            Need help? We're here to assist you with any questions or issues.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <PhoneIcon className="w-6 h-6 text-[#0078AE] mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
            <p className="text-sm text-gray-600">1-800-MO-HEALTH</p>
            <p className="text-xs text-gray-500 mt-1">Mon-Fri 8am-5pm CST</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <EnvelopeIcon className="w-6 h-6 text-[#0078AE] mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-600">support@mohealthnet.gov</p>
            <p className="text-xs text-gray-500 mt-1">Response within 24-48 hours</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <ClockIcon className="w-6 h-6 text-[#0078AE] mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
            <p className="text-sm text-gray-600">Monday - Friday</p>
            <p className="text-xs text-gray-500 mt-1">8:00 AM - 5:00 PM CST</p>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">Request Submitted!</h3>
              <p className="mt-1 text-sm text-green-700">
                Your support request has been received. A caseworker will review it and
                respond shortly.
              </p>
            </div>
          </div>
        )}

        {/* Support Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Submit a Support Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What can we help you with?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = formData.category === category.value;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            category: category.value,
                          }))
                        }
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? `border-[#0078AE] ${category.bgColor}`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 mb-2 ${
                            isSelected ? category.color : "text-gray-400"
                          }`}
                        />
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {category.label}
                        </h3>
                        <p className="text-xs text-gray-600">{category.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priority Level
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078AE] focus:border-transparent"
                  required
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Need assistance</option>
                  <option value="high">High - Urgent issue</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief summary of your request"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078AE] focus:border-transparent"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about your request..."
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0078AE] focus:border-transparent resize-none"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Please include any relevant details to help us assist you better.
                </p>
              </div>

              {/* User Info Display */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Submitting as:</span> {user?.firstName}{" "}
                  {user?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {user?.username}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0078AE] text-white rounded-lg hover:bg-[#005f8e] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                How long does it take to process my application?
              </h3>
              <p className="text-sm text-gray-600">
                Most applications are reviewed within 5-7 business days. You'll receive a
                notification once your application status changes.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                Can I update my application after submission?
              </h3>
              <p className="text-sm text-gray-600">
                Yes, you can view and update your application details from the "My
                Applications" page before it's reviewed by a caseworker.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                How do I check my application status?
              </h3>
              <p className="text-sm text-gray-600">
                Navigate to the "My Applications" page from the dashboard to see the current
                status of all your submitted applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

