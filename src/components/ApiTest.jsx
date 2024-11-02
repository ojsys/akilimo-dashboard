// src/components/ApiTest.jsx
import React, { useState } from 'react';

const API_BASE = '/api';

const ApiTest = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Basic GET request without auth
      console.log('Test 1: Basic GET request');
      const getResult = await fetch(`${API_BASE}/stats/requests`, {
        method: 'GET',
      });
      results.basicRequest = {
        success: true,
        status: getResult.status,
        statusText: getResult.statusText
      };

      // Test 2: Authenticated GET request
      console.log('Test 2: Authenticated GET request');
      const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
      const authResult = await fetch(`${API_BASE}/stats/requests`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        }
      });
      
      let responseBody;
      const contentType = authResult.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseBody = await authResult.json();
      } else {
        responseBody = await authResult.text();
      }

      results.authRequest = {
        success: true,
        status: authResult.status,
        statusText: authResult.statusText,
        contentType,
        body: responseBody
      };

    } catch (error) {
      console.error('Test failed:', error);
      results.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    } finally {
      setTestResults(results);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            className="block w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            className="block w-full p-2 border rounded"
          />
          <button
            onClick={testApi}
            disabled={loading}
            className={`w-full p-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Testing...' : 'Run API Tests'}
          </button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;




// src/components/ApiTest.jsx
// import React, { useState } from 'react';

// const ApiTest = () => {
//   const [credentials, setCredentials] = useState({ username: 'masgeek', password: 'andalite6' });
//   const [testResults, setTestResults] = useState({});
//   const [loading, setLoading] = useState(false);

//   const testApi = async () => {
//     setLoading(true);
//     const results = {};

//     try {
//       // Test 1: Basic HEAD request
//       console.log('Test 1: Basic HEAD request');
//       const headResult = await fetch('https://api.akilimo.org/v1/stats/requests', {
//         method: 'HEAD',
//       });
//       results.headRequest = {
//         success: true,
//         status: headResult.status,
//         statusText: headResult.statusText
//       };

//       // Test 2: OPTIONS request
//       console.log('Test 2: OPTIONS request');
//       const optionsResult = await fetch('https://api.akilimo.org/v1/stats/requests', {
//         method: 'OPTIONS',
//       });
//       results.optionsRequest = {
//         success: true,
//         status: optionsResult.status,
//         statusText: optionsResult.statusText,
//         headers: Object.fromEntries([...optionsResult.headers])
//       };

//       // Test 3: Authenticated GET request
//       console.log('Test 3: Authenticated GET request');
//       const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
//       const getResult = await fetch('https://api.akilimo.org/v1/stats/requests', {
//         method: 'GET',
//         headers: {
//           'Authorization': authHeader,
//           'Content-Type': 'application/json',
//         }
//       });
      
//       const responseText = await getResult.text();
//       results.getRequest = {
//         success: true,
//         status: getResult.status,
//         statusText: getResult.statusText,
//         headers: Object.fromEntries([...getResult.headers]),
//         body: responseText
//       };

//     } catch (error) {
//       console.error('Test failed:', error);
//       results.error = {
//         name: error.name,
//         message: error.message,
//         stack: error.stack
//       };
//     } finally {
//       setTestResults(results);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <input
//             type="text"
//             placeholder="Username"
//             value={credentials.username}
//             onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//             className="block w-full p-2 border rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={credentials.password}
//             onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//             className="block w-full p-2 border rounded"
//           />
//           <button
//             onClick={testApi}
//             disabled={loading}
//             className={`w-full p-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
//           >
//             {loading ? 'Testing...' : 'Run API Tests'}
//           </button>
//         </div>

//         {Object.keys(testResults).length > 0 && (
//           <div className="mt-4">
//             <h3 className="font-semibold mb-2">Test Results:</h3>
//             <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
//               {JSON.stringify(testResults, null, 2)}
//             </pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ApiTest;

// // src/components/ApiTest.jsx
// import React, { useState } from 'react';
// import { fetchConfigs } from '../lib/fetchConfigs';
// import { testConnection, fetchAkilimoData } from '../services/api';

// const ApiTest = () => {
//   const [testResults, setTestResults] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [selectedConfig, setSelectedConfig] = useState('default');
//   const [credentials, setCredentials] = useState({ username: '', password: '' });

//   const runTest = async (configName) => {
//     setLoading(true);
//     try {
//       const config = fetchConfigs[configName];
//       const result = await testConnection(config);
//       setTestResults(prev => ({
//         ...prev,
//         [configName]: { success: true, result }
//       }));
//     } catch (error) {
//       setTestResults(prev => ({
//         ...prev,
//         [configName]: { success: false, error: error.message }
//       }));
//     }
//     setLoading(false);
//   };

//   const testWithCredentials = async () => {
//     setLoading(true);
//     try {
//       const result = await fetchAkilimoData(credentials);
//       setTestResults(prev => ({
//         ...prev,
//         withCredentials: { success: true, result }
//       }));
//     } catch (error) {
//       setTestResults(prev => ({
//         ...prev,
//         withCredentials: { success: false, error: error.message }
//       }));
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
//       <div className="space-y-4">
//         <div>
//           <h3 className="font-semibold">Test Basic Connection</h3>
//           <select 
//             value={selectedConfig}
//             onChange={(e) => setSelectedConfig(e.target.value)}
//             className="mt-1 block w-full p-2 border rounded"
//           >
//             {Object.keys(fetchConfigs).map(config => (
//               <option key={config} value={config}>{config}</option>
//             ))}
//           </select>
//           <button
//             onClick={() => runTest(selectedConfig)}
//             disabled={loading}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Run Test
//           </button>
//         </div>

//         <div>
//           <h3 className="font-semibold">Test With Credentials</h3>
//           <input
//             type="text"
//             placeholder="Username"
//             value={credentials.username}
//             onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//             className="mt-1 block w-full p-2 border rounded"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={credentials.password}
//             onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//             className="mt-1 block w-full p-2 border rounded"
//           />
//           <button
//             onClick={testWithCredentials}
//             disabled={loading}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Test With Credentials
//           </button>
//         </div>

//         <div>
//           <h3 className="font-semibold">Results:</h3>
//           <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
//             {JSON.stringify(testResults, null, 2)}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApiTest;