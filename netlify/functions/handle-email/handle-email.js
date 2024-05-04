const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    // Return a 405 Method Not Allowed response if the function is not called with a POST request
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { "Allow": "POST" }
    };
  }

  try {
    // Parse the JSON body from the request
    const data = JSON.parse(event.body);
    const subject = data.name || 'World';

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler };
