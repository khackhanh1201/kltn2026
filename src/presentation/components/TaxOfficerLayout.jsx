import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RED = '#a30d11';

const TaxOfficerLayout = ({ children, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const userRaw = user || JSON.parse(localStorage.getItem('user_info') || '{}');
  const userData = userRaw?.data || userRaw;
  const displayName = userData?.fullName || 'Cán bộ Thuế';
  const initial = displayName[0]?.toUpperCase() || 'C';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <header style={{ height: 64, backgroundColor: RED, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 1001 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
          <div style={{ width: 36, height: 36, background: '#ffc107', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>⭐</div>
          <div className="text-white">
            <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Hệ thống Quản lý</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Đất đai và Thuế đất đai</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 380, margin: '0 32px' }}>
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 14 }} />
            <input
              type="text"
              placeholder="Tìm kiếm chức năng..."
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: 'none', fontSize: 13, background: 'rgba(255,255,255,0.15)', color: '#fff', outline: 'none' }}
            />
          </div>
        </div>

        {/* Right icons + user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#fff' }} ref={dropdownRef}>
          {/* Bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <i className="bi bi-bell fs-5" />
            <span style={{ position: 'absolute', top: -4, right: -6, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>4</span>
          </div>
          <i className="bi bi-question-circle fs-5" style={{ cursor: 'pointer', opacity: 0.85 }} />
          <i className="bi bi-sliders fs-5" style={{ cursor: 'pointer', opacity: 0.85 }} />

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingLeft: 8, borderLeft: '1px solid rgba(255,255,255,0.25)' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div style={{ width: 34, height: 34, background: '#b91c1c', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff' }}>{initial}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Cán bộ Thuế</div>
              <div style={{ fontSize: 11, color: '#fca5a5' }}>Cơ quan Thuế</div>
            </div>
            <i className="bi bi-chevron-down" style={{ fontSize: 11, opacity: 0.7 }} />
          </div>

          {isDropdownOpen && (
            <div style={{ position: 'absolute', top: 70, right: 20, width: 200, background: '#fff', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 2000, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{displayName}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Cán bộ Thuế</div>
              </div>
              <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', fontSize: 13, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-box-arrow-right" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, background: '#f1f5f9', overflow: 'hidden' }}>

        {/* Sidebar */}
        <nav style={{ width: 220, background: '#fff', margin: '14px 0 14px 14px', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 10px', flex: 1 }}>
            <NavItem active={location.pathname === '/tax-officer/dashboard'}         icon="bi-grid-3x3-gap-fill"       label="Bảng điều khiển"     onClick={() => navigate('/tax-officer/dashboard')} />
            <NavItem active={location.pathname === '/tax-officer/tax-records'}        icon="bi-archive-fill"            label="Hồ sơ thuế"          onClick={() => navigate('/tax-officer/tax-records')} />
            <NavItem active={location.pathname === '/tax-officer/tax-processing'}     icon="bi-file-earmark-check-fill" label="Xử lý khai thuế"     onClick={() => navigate('/tax-officer/tax-processing')} badge="5" />
            <NavItem active={location.pathname === '/tax-officer/payment-management'} icon="bi-credit-card-2-front-fill" label="Quản lý thanh toán" onClick={() => navigate('/tax-officer/payment-management')} />
            <NavItem active={location.pathname === '/tax-officer/complaint-management'} icon="bi-chat-square-text-fill" label="Xử lý khiếu nại"    onClick={() => navigate('/tax-officer/complaint-management')} />
            <NavItem active={location.pathname === '/tax-officer/report-management'}  icon="bi-bar-chart-fill"          label="Báo cáo thống kê"    onClick={() => navigate('/tax-officer/report-management')} />
            <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />
            <NavItem active={location.pathname === '/tax-officer/account'}            icon="bi-person-circle"           label="Tài khoản"           onClick={() => navigate('/tax-officer/account')} />
          </div>
        </nav>

        {/* Main content + footer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>{children}</main>

          {/* Footer */}
          <footer style={{ padding: '12px 24px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#64748b', flexShrink: 0 }}>
            <span><i className="bi bi-building me-1" />Cơ quan Thuế / Cơ quan Địa chính Việt Nam</span>
            <span><i className="bi bi-telephone me-1" />Hotline: 1900 xxxx</span>
            <span><i className="bi bi-book me-1" />Hướng dẫn sử dụng hệ thống</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick, badge }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', padding: '11px 14px', borderRadius: 10,
      cursor: 'pointer', marginBottom: 2, transition: 'all 0.2s',
      background: active ? RED : 'transparent',
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
  >
    <i className={`bi ${icon}`} style={{ fontSize: 16, color: active ? '#fff' : '#6c757d', marginRight: 10 }} />
    <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? '#fff' : '#374151', flex: 1 }}>
      {label}
    </span>
    {badge && (
      <span style={{ background: active ? 'rgba(255,255,255,0.3)' : '#ef4444', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{badge}</span>
    )}
  </div>
);

export default TaxOfficerLayout;
