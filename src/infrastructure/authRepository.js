// src/infrastructure/authRepository.js

const API_BASE = "http://localhost:9090/api";  // Backend chạy port 9090

export const authRepository = {
  // Đăng nhập bằng CCCD + mật khẩu
  login: async (citizenId, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cccdNumber: citizenId.trim(),
          password 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Số định danh hoặc mật khẩu không đúng");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  },

  // Bước 1: Yêu cầu gửi OTP kích hoạt
  activateRequestOtp: async ({ cccdNumber, phoneNumber, email }) => {
    try {
      const response = await fetch(`${API_BASE}/vneid/activate/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cccdNumber: cccdNumber.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim() 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể gửi yêu cầu OTP");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Lỗi khi yêu cầu OTP. Vui lòng kiểm tra thông tin.");
    }
  },

  // Bước 2: Xác thực mã OTP
  activateVerifyOtp: async ({ cccdNumber, otpCode }) => {
    try {
      const response = await fetch(`${API_BASE}/vneid/activate/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cccdNumber: cccdNumber.trim(),
          otpCode: otpCode.trim() 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Mã OTP không hợp lệ hoặc đã hết hạn");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Xác thực OTP thất bại.");
    }
  },

  // Bước 3: Đặt mật khẩu và kích hoạt tài khoản
  activateSetPassword: async ({ cccdNumber, password, passcode }) => {
    try {
      const response = await fetch(`${API_BASE}/vneid/activate/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cccdNumber: cccdNumber.trim(),
          password,
          passcode: passcode.trim() 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Kích hoạt tài khoản thất bại");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Lỗi khi đặt mật khẩu. Vui lòng thử lại.");
    }
  },

  // Tạo mã QR đăng nhập
  generateQr: async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/qr-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tạo mã QR");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Lỗi khi tạo QR. Vui lòng thử lại.");
    }
  },

  // Kiểm tra trạng thái QR (polling)
  checkQrStatus: async (qrToken) => {
    try {
      const response = await fetch(`${API_BASE}/auth/qr-status?token=${encodeURIComponent(qrToken)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể kiểm tra trạng thái QR");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Lỗi khi kiểm tra QR status.");
    }
  },
};