
import React, { useEffect, useState } from 'react';

const TestAuth = () => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    setUserData(user ? JSON.parse(user) : null);
    setToken(token || null);
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Authentication Status</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p><strong>Token:</strong> {token ? '✅ Present' : '❌ Missing'}</p>
        <p><strong>User Data:</strong> {userData ? '✅ Present' : '❌ Missing'}</p>
        {userData && (
          <div className="mt-2">
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.href = '/admin'}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg"
        >
          Go to Admin
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
};

export default TestAuth;
