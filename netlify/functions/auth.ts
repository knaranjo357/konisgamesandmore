import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    // Ensure we have a body to parse
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Missing request body'
        })
      };
    }

    const { email, password } = JSON.parse(event.body);

    // Validate required fields
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Email and password are required'
        })
      };
    }

    if (email === 'admin@konisgames.net' && password === 'konisgamesandmore') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Authentication successful',
          token: 'dummy-token' // In a real app, generate a proper JWT
        })
      };
    }

    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ 
        message: 'Invalid credentials'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Internal server error'
      })
    };
  }
};

export { handler };