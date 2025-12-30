const axios = require("axios");

const callAI = async (text) => {
  const response = await axios.post(
    "http://127.0.0.1:5000/predict",
    { text },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

module.exports = callAI;
