const Documentation = ({ file, onFileChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Required Documents</h3>
        <p className="text-gray-600">Please provide proof of your activity to verify eligibility</p>
      </div>
      
      <div className={`
        border-3 border-dashed rounded-3xl p-8 text-center transition-all duration-200
        ${errors.file ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'}
      `}>
        <i className={`fas fa-cloud-upload-alt text-5xl mb-4 ${errors.file ? 'text-red-400' : 'text-blue-400'}`}></i>
        
        <label className="block cursor-pointer">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={onFileChange}
            className="hidden"
          />
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all">
            <i className="fas fa-folder-open"></i>
            Choose File
          </div>
        </label>
        
        {file ? (
          <div className="mt-4 p-4 bg-green-100 rounded-2xl">
            <i className="fas fa-check-circle text-green-600 text-xl mr-2"></i>
            <span className="text-green-800 font-medium">{file.name}</span>
            <p className="text-green-600 text-sm mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No file selected</p>
        )}
        
        {errors.file && (
          <p className="text-red-500 text-sm mt-3 flex items-center justify-center gap-1">
            <i className="fas fa-exclamation-circle"></i>
            {errors.file}
          </p>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            <i className="fas fa-info-circle mr-1"></i>
            Accepted formats: PDF, JPG, PNG, DOC (Max 10MB)
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-shield-alt text-blue-600 mt-0.5"></i>
          <p className="text-sm text-blue-800">
            Your document will be securely stored and only used for verification purposes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Documentation