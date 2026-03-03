import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(citizenId, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5 className="fw-bold mb-4">Đăng nhập VNeID</h5>
      <div className="input-group mb-3">
        <span className="input-group-text bg-white border-end-0"><i className="bi bi-person"></i></span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Số định danh cá nhân"
          value={citizenId}
          onChange={(e) => setCitizenId(e.target.value)}
          required
        />
      </div>
      <div className="input-group mb-4">
        <span className="input-group-text bg-white border-end-0"><i className="bi bi-lock"></i></span>
        <input
          type={showPassword ? "text" : "password"}
          className="form-control border-start-0 border-end-0"
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
      <button className="btn btn-danger w-100 fw-bold py-2" type="submit" style={{backgroundColor: '#bb1a20', border: 'none'}}>
        Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;