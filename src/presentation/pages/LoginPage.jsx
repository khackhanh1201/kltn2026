// src/presentation/pages/LoginPage.jsx
import React, { useState } from 'react';
import { authRepository } from '../../infrastructure/authRepository';
import 'bootstrap/dist/css/bootstrap.min.css';

// Thêm prop onLoginSuccess để báo hiệu cho App.jsx
const LoginPage = ({ onLoginSuccess }) => {
  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authRepository.login(citizenId, password);
      
      // Lưu toàn bộ thông tin người dùng vào localStorage theo yêu cầu Backend
      localStorage.setItem('user_info', JSON.stringify(data));
      localStorage.setItem('token', data.token);

      // Gọi hàm callback để App.jsx cập nhật lại state và chuyển trang
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (err) {
      alert(err.message || 'Số định danh hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Logo */}
      <div className="text-center mb-4">
        <img 
          src="https://vneid.gov.vn/_next/static/media/logo-full-vneid.c28b5b54.png"
          alt="VNeID Logo" 
          style={{ width: '230px' }} 
        />
      </div>

      {/* Login Card */}
      <div className="card shadow-lg border-0" style={styles.card}>
        <div className="card-body p-5">
          <div className="row">
            {/* Left: Form */}
            <div className="col-md-6 border-end">
              <h5 className="fw-bold mb-4">Đăng nhập VNeID</h5>
              <form onSubmit={handleLogin}>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 shadow-none"
                    placeholder="Số định danh cá nhân"
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group mb-4">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-start-0 border-end-0 shadow-none"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span 
                    className="input-group-text bg-white border-start-0" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                  </span>
                </div>
                <button 
                  className="btn btn-danger w-100 fw-bold py-2" 
                  type="submit" 
                  style={styles.btnRed}
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
              </form>
              <p className="text-center mt-3 small">
                Tài khoản đã được định danh điện tử? <a href="#" className="text-danger text-decoration-none fw-bold">Kích hoạt</a>
              </p>
            </div>

            {/* Right: QR Code */}
            <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=vneid-mock-auth" 
                alt="QR Code" 
                className="img-fluid border p-2 rounded"
              />
              <p className="small text-muted mt-3 text-center px-4">
                Quét mã QR bằng ứng dụng <span className="text-danger fw-bold">VNeID</span> để đăng nhập
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... giữ nguyên styles bên dưới
const styles = {
  container: {
    backgroundImage: `url('https://cdn-media.sforum.vn/storage/app/media/mylinh/hinh-nen-powerpoint-trong-dong-hoa-sen-36.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    width: '100vw'
  },
  card: {
    maxWidth: '850px',
    width: '100%',
    borderRadius: '20px'
  },
  btnRed: {
    backgroundColor: '#bb1a20',
    border: 'none'
  }
};

export default LoginPage;