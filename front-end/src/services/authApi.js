const BASE_URL = "http://127.0.0.1:8000/api";

export const apiService = {
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Backend did not return JSON");
    }

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  async register(userData) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Backend did not return JSON");
    }

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },
};