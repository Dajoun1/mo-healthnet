import React, { useState } from 'react';
import { authService } from '../services/api';

const TestConnection = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);
  const [loginError, setLoginError] = useState('');

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

  const handleLoginTest = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginResponse(null);

    try {
      const data = await authService.login({ email, password });
      setLoginResponse(data);
      console.log('Login response:', data);
    } catch (err) {
      setLoginError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl space-y-6">

        {/* Connection Test Card */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
            Test Backend Connection
          </h2>

          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="w-full px-4 py-2 text-white rounded-md bg-[#0078AE] hover:bg-[#1a89bd] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test /auth/login Endpoint (GET)'}
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
            <p><strong>Endpoint:</strong> GET /auth/login</p>
          </div>
        </div>

        {/* Login Test Form Card */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
            Test Login Authentication
          </h2>

          <form onSubmit={handleLoginTest} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full px-4 py-2 text-white rounded-md bg-[#0078AE] hover:bg-[#1a89bd] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? 'Logging in...' : 'Test Login (POST)'}
            </button>
          </form>

          {loginResponse && (
            <div className="p-4 mt-4 text-green-700 bg-green-100 rounded-md">
              <h3 className="font-semibold">Login Successful!</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>User ID:</strong> {loginResponse.userId}</p>
                <p><strong>Name:</strong> {loginResponse.firstName} {loginResponse.lastName}</p>
                <p><strong>Email:</strong> {loginResponse.email}</p>
                <p><strong>Role:</strong> {loginResponse.role}</p>
              </div>
            </div>
          )}

          {loginError && (
            <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-md">
              <h3 className="font-semibold">Login Failed</h3>
              <p className="mt-2">{loginError}</p>
            </div>
          )}

          <div className="p-4 mt-4 text-sm text-gray-600 bg-gray-50 rounded-md">
            <p><strong>Endpoint:</strong> POST /auth/login</p>
            <p className="mt-2"><strong>Test Credentials:</strong></p>
            <div className="mt-2 space-y-1 text-xs font-mono">
              <p>• applicant@test.com / applicant123</p>
              <p>• admin@test.com / admin123</p>
              <p>• caseworker@test.com / caseworker123</p>
            </div>
            <p className="text-xs mt-2 italic">Run TestPasswordHashGenerator.java and insert users into database first.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TestConnection;

