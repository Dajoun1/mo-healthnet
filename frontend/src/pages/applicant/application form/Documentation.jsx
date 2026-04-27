
const Documentation = ({ files, onFilesChange, errors }) => {

  const acceptedFormats = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
  const maxSizeMB = 10;

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = [];
    const errorMessages = [];

    newFiles.forEach(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        errorMessages.push(`${file.name} exceeds ${maxSizeMB}MB`);
      } else {
        validFiles.push({
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          status: 'pending'
        });
      }
    });

    if (errorMessages.length > 0) {
      alert(errorMessages.join('\n'));
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...(files || []), ...validFiles];
      onFilesChange(updatedFiles);
    }

    e.target.value = '';
  };

  const removeFile = (fileId) => {
    const updatedFiles = (files || []).filter(f => f.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fa-file-pdf text-red-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fa-file-image text-green-500';
      case 'doc':
      case 'docx':
        return 'fa-file-word text-blue-500';
      default:
        return 'fa-file text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Required Documents</h3>
        <p className="text-gray-600">Please provide proof of your activities to verify eligibility</p>
        <p className="text-sm text-gray-500 mt-1">You can upload multiple documents</p>
      </div>

      {/* Upload Area */}
      <div className={`
        border-3 border-dashed rounded-3xl p-8 text-center transition-all duration-200
        ${errors?.file ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50/50'}
      `}>
        <i className={`fas fa-cloud-upload-alt text-5xl mb-4 ${errors?.file ? 'text-red-400' : 'text-blue-400'}`}></i>
        
        <label className="block cursor-pointer">
          <input
            type="file"
            accept={acceptedFormats}
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#0078AE] text-white rounded-2xl font-semibold hover:bg-[#005f8e] transition-all">
            <i className="fas fa-folder-open"></i>
            Choose Files
          </div>
        </label>
        
        <p className="text-gray-500 mt-4">or drag and drop files here</p>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            <i className="fas fa-info-circle mr-1"></i>
            Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max {maxSizeMB}MB per file)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files && files.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <i className="fas fa-paperclip text-[#0078AE]"></i>
              Uploaded Documents ({files.length})
            </h4>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to remove all documents?')) {
                  onFilesChange([]);
                }
              }}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <i className="fas fa-trash-alt mr-1"></i>
              Remove All
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((fileItem, index) => (
              <div key={fileItem.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <i className={`fas ${getFileIcon(fileItem.name)} text-2xl`}></i>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 break-all">{fileItem.name}</p>
                      <div className="flex gap-3 text-xs text-gray-500 mt-1">
                        <span>{formatFileSize(fileItem.size)}</span>
                        <span>•</span>
                        <span>{new Date(fileItem.uploadDate).toLocaleDateString()}</span>
                      </div>
                      {fileItem.description && (
                        <p className="text-sm text-gray-600 mt-2">{fileItem.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="text-red-500 hover:text-red-700 transition-colors ml-2"
                    title="Remove file"
                  >
                    <i className="fas fa-times-circle"></i>
                  </button>
                </div>
                
                {/* Optional: Add description for each file */}
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Add description (optional)"
                    value={fileItem.description || ''}
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index].description = e.target.value;
                      onFilesChange(updatedFiles);
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#0078AE] focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-lightbulb text-blue-600 mt-0.5"></i>
          <div>
            <p className="text-sm font-semibold text-blue-800">Tips for faster approval:</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Upload clear, legible documents</li>
              <li>• Include all relevant pages</li>
              <li>• Name files clearly (e.g., "Employment_Proof_CompanyName.pdf")</li>
              <li>• Add descriptions to help us process your documents faster</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#0078AE]/5 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-shield-alt text-[#0078AE] mt-0.5"></i>
          <p className="text-sm text-blue-800">
            Your documents will be securely stored and only used for verification purposes.
            All files are encrypted and protected.
          </p>
        </div>
      </div>

      {errors?.file && (
        <p className="text-red-500 text-sm mt-3 flex items-center justify-center gap-1">
          <i className="fas fa-exclamation-circle"></i>
          {errors.file}
        </p>
      )}
    </div>
  );
};

export default Documentation;