import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaxOfficerLayout from '../../components/TaxOfficerLayout';
import { userApi } from '../../../infrastructure/api/userApi';

const TaxOfficerAccountPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchUserInfo(); }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const json = await userApi.syncProfile();
      const userData = json.profile || json.data || json;
      setUserInfo({
        fullName:  userData.fullName  || userData.name        || 'Cán bộ Thuế',
        citizenId: userData.cccdNumber || userData.citizenId  || '—',
        phone:     userData.phone     || userData.phoneNumber || '—',
        email:     userData.email     || '—',
        address:   userData.address   || '—',
        dob:       userData.dateOfBirth
          ? new Date(userData.dateOfBirth).toLocaleDateString('vi-VN')
          : userData.dob ? new Date(userData.dob).toLocaleDateString('vi-VN') : '—',
        avatarInitial: (userData.fullName || 'C')[0].toUpperCase(),
        role: 'Cán bộ Thuế',
      });
    } catch {
      setError('Không thể tải thông tin tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const Field = ({ label, value, icon }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {icon && <i className={`bi ${icon} me-1`} />}{label}
      </div>
      <div style={{ fontSize: 15, color: '#1e293b', fontWeight: 500, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
        {value || '—'}
      </div>
    </div>
  );

  return (
    <TaxOfficerLayout>
      <div style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>Tài khoản</h3>
          <p style={{ color: '#64748b', margin: '4px 0 0' }}>Thông tin tài khoản cán bộ thuế</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="spinner-border text-danger" />
            <p style={{ marginTop: 12, color: '#64748b' }}>Đang tải thông tin...</p>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && userInfo && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
            {/* Avatar card */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#a30d11', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 auto 16px' }}>
                {userInfo.avatarInitial}
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#1e293b' }}>{userInfo.fullName}</div>
              <div style={{ marginTop: 6 }}>
                <span style={{ background: '#fee2e2', color: '#a30d11', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  <i className="bi bi-shield-check me-1" />{userInfo.role}
                </span>
              </div>
              <div style={{ marginTop: 20, padding: '12px 0', borderTop: '1px solid #f1f5f9', fontSize: 13, color: '#64748b' }}>
                <i className="bi bi-person-badge me-2" />CCCD: {userInfo.citizenId}
              </div>
              <button
                onClick={handleLogout}
                style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #fee2e2', background: '#fff', color: '#a30d11', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
              >
                <i className="bi bi-box-arrow-right me-2" />Đăng xuất
              </button>
            </div>

            {/* Info card */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h5 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>
                <i className="bi bi-info-circle me-2 text-danger" />Thông tin cá nhân
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <Field label="Họ và tên"        value={userInfo.fullName}  icon="bi-person" />
                <Field label="Số CCCD"           value={userInfo.citizenId} icon="bi-credit-card" />
                <Field label="Số điện thoại"     value={userInfo.phone}     icon="bi-telephone" />
                <Field label="Email"             value={userInfo.email}     icon="bi-envelope" />
                <Field label="Ngày sinh"         value={userInfo.dob}       icon="bi-calendar" />
                <Field label="Địa chỉ"           value={userInfo.address}   icon="bi-geo-alt" />
              </div>

              <div style={{ marginTop: 8, padding: '14px 16px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, fontSize: 13, color: '#9a3412' }}>
                <i className="bi bi-info-circle me-2" />
                Để thay đổi thông tin, vui lòng liên hệ bộ phận quản trị hệ thống.
              </div>
            </div>
          </div>
        )}
      </div>
    </TaxOfficerLayout>
  );
};

export default TaxOfficerAccountPage;
