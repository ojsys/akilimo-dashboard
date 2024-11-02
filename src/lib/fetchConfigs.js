// src/lib/fetchConfigs.js
export const fetchConfigs = {
    // Default configuration
    default: {
      headers: {
        'Content-Type': 'application/json',
      }
    },
    
    // With CORS configuration
    withCors: {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    },
    
    // No-CORS configuration
    noCors: {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      }
    },
    
    // Credentials only
    credentialsOnly: {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  };