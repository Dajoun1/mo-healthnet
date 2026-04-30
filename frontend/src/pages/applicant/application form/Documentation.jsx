import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';

const Documentation = ({ onFilesChange }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxFileSize = 50 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    const errors = [];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: Invalid file type. Please upload PDF, JPG, PNG, or DOC files.`);
    }
    
    if (file.size > maxFileSize) {
      errors.push(`${file.name}: File too large. Maximum size is 10MB.`);
    }
    
    return errors;
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    let allErrors = [];
    
    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      allErrors = [...allErrors, ...fileErrors];
    });
    
    if (allErrors.length > 0) {
      setErrors(allErrors);
      return;
    }
    
    setErrors([]);
    const newFiles = [...selectedFiles, ...fileArray];
    setSelectedFiles(newFiles);
    onFilesChange && onFilesChange(newFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange && onFilesChange(newFiles);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Supporting Documents</h3>
        <p className="text-gray-600">Proof of activity documents help verify your eligibility</p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">Upload Errors:</span>
          </div>
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 ml-7">{error}</p>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-3xl p-10 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium mb-2">
          Drag and drop files here, or{' '}
          <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
            browse
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-gray-400 text-sm">
          Accepted formats: PDF, JPG, PNG, DOC (Max 50MB each)
        </p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white border rounded-lg p-3">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#0078AE]/5 rounded-2xl p-4 flex items-start gap-3">
        <i className="fas fa-info-circle text-[#0078AE] mt-0.5"></i>
        <p className="text-sm text-blue-800">
          Upload documents that support your application. All files will be securely stored and reviewed by our team.
        </p>
      </div>
    </div>
  );
};

export default Documentation;