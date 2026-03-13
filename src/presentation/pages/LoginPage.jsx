import React, { useState, useEffect, useRef } from 'react';
import { authRepository } from '../../infrastructure/authRepository';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Spinner } from 'react-bootstrap';

const LoginPage = ({ onLoginSuccess }) => {
  const [view, setView] = useState('login'); // 'login' hoặc 'activate'
  const [activationStep, setActivationStep] = useState(1); // 1,2,3

  // ── Đăng nhập thường ──
  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ── Kích hoạt tài khoản ──
  const [cccdNumber, setCccdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [activationLoading, setActivationLoading] = useState(false);
  const [activationMessage, setActivationMessage] = useState('');
  const [activationError, setActivationError] = useState('');

  // ── Đăng nhập QR ──
  const [qrData, setQrData] = useState(null);           // { qrToken, qrBase64Image, expiresAt }
  const [qrStatus, setQrStatus] = useState('idle');     // idle | generating | polling | success | expired
  const [qrError, setQrError] = useState('');
  const pollIntervalRef = useRef(null);

  const resetActivationForm = () => {
    setCccdNumber('');
    setPhoneNumber('');
    setEmail('');
    setOtpCode('');
    setNewPassword('');
    setPasscode('');
    setMaskedEmail('');
    setActivationStep(1);
    setActivationMessage('');
    setActivationError('');
  };

  // ── ĐĂNG NHẬP THƯỜNG ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const data = await authRepository.login(citizenId, password);
      localStorage.setItem('user_info', JSON.stringify(data));
      localStorage.setItem('token', data.token || data.data?.token);
      if (onLoginSuccess) onLoginSuccess(data);
    } catch (err) {
      setLoginError(err.message || 'Số định danh hoặc mật khẩu không đúng');
    } finally {
      setLoginLoading(false);
    }
  };

  // ── KÍCH HOẠT - BƯỚC 1 ──
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setActivationError('');
    setActivationMessage('');

    const trimmedCccd = cccdNumber.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedEmail = email.trim();

    if (!/^\d{12}$/.test(trimmedCccd)) {
      setActivationError('Số CCCD phải đúng 12 chữ số');
      return;
    }
    if (!trimmedPhone || !/^\d{9,11}$/.test(trimmedPhone)) {
      setActivationError('Số điện thoại không hợp lệ (9-11 số)');
      return;
    }
    if (!trimmedEmail || !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setActivationError('Email không hợp lệ');
      return;
    }

    setActivationLoading(true);
    try {
      const response = await authRepository.activateRequestOtp({
        cccdNumber: trimmedCccd,
        phoneNumber: trimmedPhone,
        email: trimmedEmail,
      });
      if (response.success) {
        setMaskedEmail(response.data.maskedEmail);
        setActivationMessage('Mã OTP đã được gửi đến email của bạn');
        setActivationStep(2);
      }
    } catch (err) {
      const msg = err.message;
      if (msg.includes('đã được kích hoạt')) {
        setActivationError('Tài khoản đã kích hoạt. Vui lòng đăng nhập!');
        setTimeout(() => setView('login'), 3000);
      } else {
        setActivationError(msg || 'Không thể gửi OTP');
      }
    } finally {
      setActivationLoading(false);
    }
  };

  // ── KÍCH HOẠT - BƯỚC 2 ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setActivationLoading(true);
    setActivationError('');
    try {
      const response = await authRepository.activateVerifyOtp({
        cccdNumber: cccdNumber.trim(),
        otpCode: otpCode.trim(),
      });
      if (response.success) {
        setActivationMessage('Mã OTP hợp lệ. Vui lòng thiết lập mật khẩu.');
        setActivationStep(3);
      }
    } catch (err) {
      setActivationError(err.message || 'Mã OTP không đúng hoặc hết hạn.');
    } finally {
      setActivationLoading(false);
    }
  };

  // ── KÍCH HOẠT - BƯỚC 3 ──
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setActivationLoading(true);
    setActivationError('');
    try {
      const response = await authRepository.activateSetPassword({
        cccdNumber: cccdNumber.trim(),
        password: newPassword,
        passcode: passcode,
      });
      if (response.success) {
        setActivationMessage('Kích hoạt thành công! Đang chuyển về đăng nhập...');
        setTimeout(() => {
          resetActivationForm();
          setView('login');
        }, 2500);
      }
    } catch (err) {
      setActivationError(err.message || 'Không thể kích hoạt tài khoản.');
    } finally {
      setActivationLoading(false);
    }
  };

  // ── QR LOGIN ──
  const generateNewQr = async () => {
    setQrError('');
    setQrStatus('generating');
    try {
      const response = await authRepository.generateQr();
      if (response.success) {
        setQrData(response.data);
        setQrStatus('polling');
      } else {
        setQrError(response.message || 'Không thể tạo mã QR');
        setQrStatus('idle');
      }
    } catch (err) {
      setQrError(err.message || 'Lỗi kết nối');
      setQrStatus('idle');
    }
  };

  const startPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      if (!qrData?.qrToken) return;

      try {
        const res = await authRepository.checkQrStatus(qrData.qrToken);
        if (res.success) {
          const { status, token } = res.data;

          if (status === 'CONFIRMED' && token) {
            localStorage.setItem('token', token);
            if (onLoginSuccess) onLoginSuccess({ token });
            clearInterval(pollIntervalRef.current);
            setQrStatus('success');
          } else if (status === 'EXPIRED') {
            clearInterval(pollIntervalRef.current);
            setQrStatus('expired');
            setQrError('Mã QR hết hạn. Đang tạo mới...');
            setTimeout(generateNewQr, 1500);
          }
        }
      } catch (err) {
        console.error('QR poll error:', err);
      }
    }, 3000);
  };

  useEffect(() => {
    if (view === 'login') {
      generateNewQr();
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [view]);

  useEffect(() => {
    if (qrStatus === 'polling' && qrData?.qrToken) {
      startPolling();
    }
  }, [qrStatus, qrData]);

  // ── RENDER ──
  return (
    <div style={styles.container}>
      <div className="text-center mb-4">
        <img
          src="https://vneid.gov.vn/_next/static/media/logo-full-vneid.c28b5b54.png"
          alt="VNeID Logo"
          style={{ width: '230px' }}
        />
      </div>

      <div className="card shadow-lg border-0" style={styles.card}>
        <div className="card-body p-5">
          {view === 'login' ? (
            <div className="row">
              {/* Đăng nhập thường */}
              <div className="col-md-6 border-end text-dark">
                <h5 className="fw-bold mb-4">Đăng nhập VNeID</h5>

                {loginError && <Alert variant="danger">{loginError}</Alert>}

                <form onSubmit={handleLogin}>
                  <div className="input-group mb-3">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Số định danh cá nhân (CCCD)"
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
                      type={showPassword ? 'text' : 'password'}
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

                  <button
                    className="btn btn-danger w-100 fw-bold py-2"
                    type="submit"
                    style={styles.btnRed}
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <>
                        <Spinner animation="border" size="sm" /> Đang xử lý...
                      </>
                    ) : (
                      'Đăng nhập'
                    )}
                  </button>
                </form>

                <p className="text-center mt-4 small">
                  Chưa có tài khoản hoạt động?{' '}
                  <span
                    className="text-danger fw-bold"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setView('activate');
                      resetActivationForm();
                    }}
                  >
                    Kích hoạt ngay
                  </span>
                </p>
              </div>

              {/* Đăng nhập QR */}
              <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
                {qrStatus === 'generating' && <Spinner animation="border" variant="danger" className="mb-3" />}

                {qrError && <Alert variant="danger" className="text-center w-100 mb-3">{qrError}</Alert>}

                {qrStatus === 'success' && (
                  <Alert variant="success" className="text-center w-100 mb-3">
                    Đăng nhập thành công! Đang chuyển hướng...
                  </Alert>
                )}

                {qrData && qrStatus !== 'success' && (
                  <>
                    <img
                      src={`data:image/png;base64,${qrData.qrBase64Image}`}
                      alt="QR Code Đăng nhập VNeID"
                      className="img-fluid border p-3 rounded mb-3"
                      style={{ maxWidth: '220px', background: '#fff' }}
                    />
                    <p className="small text-muted text-center px-4 mb-2">
                      Quét mã QR bằng ứng dụng <strong className="text-danger">VNeID</strong> trên điện thoại
                    </p>
                    {qrStatus === 'expired' && (
                      <p className="small text-warning">Mã QR hết hạn, đang tạo mới...</p>
                    )}
                    {qrStatus === 'polling' && (
                      <p className="small text-secondary">Đang chờ quét mã...</p>
                    )}
                  </>
                )}

                <button
                  className="btn btn-outline-danger btn-sm mt-3"
                  onClick={generateNewQr}
                  disabled={qrStatus === 'generating' || qrStatus === 'success'}
                >
                  Tạo mã QR mới
                </button>
              </div>
            </div>
          ) : (
            /* ── GIAO DIỆN KÍCH HOẠT ── */
            <div className="text-dark">
              <div className="d-flex align-items-center mb-4">
                <button
                  className="btn btn-light rounded-circle me-3"
                  onClick={() => {
                    setView('login');
                    resetActivationForm();
                  }}
                  style={{ width: '40px', height: '40px' }}
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
                <h4 className="fw-bold mb-0 flex-grow-1 text-center pe-5">
                  Kích hoạt tài khoản VNeID - Bước {activationStep}/3
                </h4>
              </div>

              {activationError && <Alert variant="danger">{activationError}</Alert>}
              {activationMessage && <Alert variant="success">{activationMessage}</Alert>}

              {activationStep === 1 && (
                <form onSubmit={handleRequestOtp} className="px-md-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Số CCCD (12 chữ số)"
                      value={cccdNumber}
                      onChange={(e) => setCccdNumber(e.target.value)}
                      required
                      maxLength={12}
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Số điện thoại đã đăng ký"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group mb-4">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email nhận mã OTP"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger w-100 fw-bold py-2"
                    disabled={activationLoading}
                    style={styles.btnRed}
                  >
                    {activationLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                  </button>

                  <p className="text-center mt-3 small text-muted">
                    Hệ thống sẽ gửi mã OTP đến email bạn cung cấp
                  </p>
                </form>
              )}

              {activationStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="px-md-4">
                  <p className="text-center mb-4">
                    Mã OTP đã được gửi đến <strong>{maskedEmail}</strong>
                  </p>

                  <div className="input-group mb-4">
                    <span className="input-group-text"><i className="bi bi-shield-lock"></i></span>
                    <input
                      type="text"
                      className="form-control text-center fs-4 fw-bold"
                      placeholder="Nhập mã OTP 6 số"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger w-100 fw-bold py-2"
                    disabled={activationLoading}
                    style={styles.btnRed}
                  >
                    {activationLoading ? 'Đang xác thực...' : 'Xác nhận OTP'}
                  </button>

                  <p className="text-center mt-3 small">
                    <span
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActivationStep(1)}
                    >
                      Gửi lại OTP
                    </span>
                  </p>
                </form>
              )}

              {activationStep === 3 && (
                <form onSubmit={handleSetPassword} className="px-md-4">
                  <p className="text-center mb-4">
                    Thiết lập mật khẩu cho tài khoản <strong>{cccdNumber}</strong>
                  </p>

                  <div className="mb-3">
                    <label className="form-label">Mật khẩu đăng nhập</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Tối thiểu 8 ký tự"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Mã PIN (6 số)</label>
                    <input
                      type="text"
                      className="form-control text-center fs-5 fw-bold"
                      placeholder="______"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger w-100 fw-bold py-2"
                    disabled={activationLoading}
                    style={styles.btnRed}
                  >
                    {activationLoading ? 'Đang kích hoạt...' : 'Hoàn tất kích hoạt'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  },
  card: {
    maxWidth: '850px',
    width: '100%',
    borderRadius: '20px',
  },
  btnRed: {
    backgroundColor: '#bb1a20',
    border: 'none',
  },
};

export default LoginPage;