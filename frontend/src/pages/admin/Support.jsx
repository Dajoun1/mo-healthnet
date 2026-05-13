import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const AdminSupport = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: "issue",
    subject: "",
    message: "",
    priority: "high",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    {
      value: "issue",
      label: "System Issue",
      icon: ExclamationTriangleIcon,
      color: "text-red-500",
      bgColor: "bg-red-50",
      description: "Critical system errors or security concerns",
    },
    {
      value: "question",
      label: "Administrative Query",
      icon: ChatBubbleLeftRightIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "Questions about system administration",
    },
    {
      value: "feedback",
      label: "System Enhancement",
      icon: LightBulbIcon,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Proposals for system improvements",
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
    console.log("🛡️  ADMINISTRATOR SUPPORT REQUEST");
    console.log("═══════════════════════════════════════════════════");
    console.log("Administrator:", user?.firstName, user?.lastName);
    console.log("Email:", user?.username);
    console.log("User ID:", user?.id);
    console.log("Role: ADMINISTRATOR");
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
      setFormData({
        category: "issue",
        subject: "",
        message: "",
        priority: "high",
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-10 h-10 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Administrator Support
              </h1>
              <p className="mt-1 text-gray-600">
                Priority support for system administrators
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200">
            <PhoneIcon className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Priority Line</h3>
            <p className="text-sm text-gray-600">Ext: 1000</p>
            <p className="text-xs text-gray-500 mt-1">24/7 Emergency Support</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200">
            <EnvelopeIcon className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Admin Support</h3>
            <p className="text-sm text-gray-600">admin@mohealthnet.gov</p>
            <p className="text-xs text-gray-500 mt-1">Immediate response</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200">
            <ShieldCheckIcon className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Security Issues</h3>
            <p className="text-sm text-gray-600">security@mohealthnet.gov</p>
            <p className="text-xs text-gray-500 mt-1">Critical escalation</p>
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
              <h3 className="text-sm font-medium text-green-800">
                Priority Ticket Created!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Your administrator request has been escalated. Senior IT will respond
                immediately.
              </p>
            </div>
          </div>
        )}

        {/* Support Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-purple-100">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Submit Priority Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Request Type
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
                            ? `border-purple-600 ${category.bgColor}`
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                >
                  <option value="medium">Medium - Standard request</option>
                  <option value="high">High - Urgent attention needed</option>
                  <option value="critical">Critical - System-wide impact</option>
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
                  placeholder="Brief description of the request"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Detailed Description
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Provide comprehensive details about the issue or request..."
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* User Info Display */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Submitted by:</span> {user?.firstName}{" "}
                  {user?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {user?.username}
                </p>
                <p className="text-sm text-purple-700 font-medium mt-1">
                  <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                  Administrator
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5" />
                      Submit Priority Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Admin Resources */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-purple-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Administrator Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log("🔧 Opening System Admin Panel (non-functional)");
              }}
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">System Administration</h3>
              <p className="text-sm text-gray-600 mt-1">
                Server configuration and monitoring
              </p>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log("📊 Opening Analytics Dashboard (non-functional)");
              }}
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Analytics & Reports</h3>
              <p className="text-sm text-gray-600 mt-1">System usage and performance</p>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log("🔐 Opening Security Console (non-functional)");
              }}
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Security Console</h3>
              <p className="text-sm text-gray-600 mt-1">Access logs and security settings</p>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log("📚 Opening Admin Documentation (non-functional)");
              }}
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Documentation</h3>
              <p className="text-sm text-gray-600 mt-1">Admin guides and procedures</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;

