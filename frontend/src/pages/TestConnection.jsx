import React, { useState } from 'react';
import { authService } from '../services/api';

const TestConnection = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testBackendConnection = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const data = await authService.testLogin();
      setResponse(data);
      console.log('Backend response:', data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
          Test Backend Connection
        </h2>

        <button
          onClick={testBackendConnection}
          disabled={loading}
          className="w-full px-4 py-2 text-white rounded-md bg-[#0078AE] hover:bg-[#1a89bd] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : 'Test /login Endpoint'}
        </button>

        {response && (
          <div className="p-4 mt-4 text-green-700 bg-green-100 rounded-md">
            <h3 className="font-semibold">Success!</h3>
            <p className="mt-2">{response}</p>
          </div>
        )}

        {error && (
          <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-md">
            <h3 className="font-semibold">Error</h3>
            <p className="mt-2">{error}</p>
          </div>
        )}

        <div className="p-4 mt-4 text-sm text-gray-600 bg-gray-50 rounded-md">
          <p><strong>Backend URL:</strong> http://localhost:8080</p>
          <p><strong>Endpoint:</strong> GET /login</p>
          <p></p>
          <p>This page is for demo purposes only.</p>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;

