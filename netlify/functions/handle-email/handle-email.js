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
    // Ensure event.body exists and is a string before attempting to parse it
    const data = event.body ? JSON.parse(event.body) : {};
    const subject = data.name || 'World';  // Make sure to define 'subject' if you're using it in the response

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
    };
  } catch (error) {
    return { statusCode: 500, body: `Error parsing JSON: ${error.toString()}` }
  }
}

module.exports = { handler };
