import axios from "axios";

const apiUrl = "http://localhost:8080/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function authenticateUser(email: string, password: string) {
  try {
    const response = await axios.post(
      `${apiUrl}/auth/signin`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const { token, id, role } = response.data;

      // Store token in localStorage for future use
      localStorage.setItem("authToken", token);

      // Return user details and token
      return { id, email, role, token };
    }
  } catch (error: any) {
    // Handle errors and provide more descriptive messages
    if (error.response) {
      console.error(
        `Authentication failed with status: ${error.response.status}`,
        error.response.data
      );
      return { error: error.response.data.error || "Authentication failed" };
    } else {
      console.error("Error authenticating user:", error.message);
      return { error: "Network or server error occurred" };
    }
  }

  // Return null if authentication fails
  return null;
}

export { authenticateUser, getAuthHeaders };
