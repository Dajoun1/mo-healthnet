const ApplicantDashboard = () => {
  return (
    <div className="container px-4 mx-auto my-10 py-8">
      <h1 className="text-3xl font-bold mb-6">Applicant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Application Status</h2>
          <p className="text-gray-600">Your application is under review</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <p className="text-gray-600">Upload required documents</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <p className="text-gray-600">Check your messages</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;