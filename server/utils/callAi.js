const axios = require("axios");

const callAI = async (text) => {
  const response = await axios.post(
    process.env.AI_SERVICE_URL,
    { text },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

module.exports = callAI;
