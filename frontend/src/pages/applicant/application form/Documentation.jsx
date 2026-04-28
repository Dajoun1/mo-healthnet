const Documentation = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Supporting Documents</h3>
        <p className="text-gray-600">Proof of activity documents help verify your eligibility</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center bg-gray-50/50">
        <i className="fas fa-cloud-upload-alt text-5xl text-gray-300 mb-4 block"></i>
        <p className="text-gray-500 font-medium mb-1">Document upload coming soon</p>
        <p className="text-gray-400 text-sm">
          Your application will be submitted without documents for now.<br />
          You may be contacted to provide supporting documents later.
        </p>
      </div>

      <div className="bg-[#0078AE]/5 rounded-2xl p-4 flex items-start gap-3">
        <i className="fas fa-info-circle text-[#0078AE] mt-0.5"></i>
        <p className="text-sm text-blue-800">
          Accepted formats will include: PDF, JPG, PNG, DOC (Max 10MB).
          Document upload will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default Documentation;
