const CaseworkerDashboard = () => {
  return (
    <div className="container px-4 mx-auto py-8 my-10">
      <h1 className="text-3xl font-bold mb-6">Caseworker Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Cases</h2>
          <p className="text-gray-600">15 cases awaiting review</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
          <p className="text-gray-600">8 applications to process</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Appointments</h2>
          <p className="text-gray-600">3 scheduled for today</p>
        </div>
      </div>
    </div>
  );
};

export default CaseworkerDashboard;