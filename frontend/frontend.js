const axios = require("axios");

const username = "sahil";
const password = "sahil@12345";

(async () => {
  try {
    const response = await axios.post("http://localhost:3001/v1/login", {
      username: username,
      password: password,
    });
    console.log("JWT:", response.headers.jwt);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from /data/all:", error);
    throw error;
  }
})();
