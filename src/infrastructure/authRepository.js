// src/infrastructure/authRepository.js
const API_URL = "http://localhost:9090/api/auth"; // Thêm /auth vào đây

export const authRepository = {
  login: async (citizenId, password) => {
    // Gọi đến đúng endpoint: http://localhost:9090/api/auth/login
    const response = await fetch(`${API_URL}/login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ citizenId, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Đăng nhập thất bại");
    }
    return response.json();
  }
};