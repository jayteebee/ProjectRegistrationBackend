const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: { "Allow": "POST" }
    };
  }

  try {
    const data = event.body ? JSON.parse(event.body) : {};
    console.log("Received data:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Adjust according to your security requirements
      }
    };
  } catch (error) {
    console.error("Error handling the request:", error);
    return {
      statusCode: 500,
      body: `Error parsing JSON: ${error.toString()}`,
      headers: {
        "Content-Type": "application/json"
      }
    }
  }
}

module.exports = { handler };
