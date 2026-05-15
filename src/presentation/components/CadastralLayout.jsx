import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CadastralLayout = ({ children, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header} className="d-flex justify-content-between align-items-center px-4">
        <div className="d-flex align-items-center">
          <img src="https://vneid.gov.vn/_next/static/media/logo-full-vneid.c28b5b54.png" alt="logo" style={{ height: '35px' }} />
          <div className="ms-3 text-white text-start d-none d-md-block">
            <div className="fw-bold" style={{ fontSize: '13px', lineHeight: '1.2' }}>VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI</div>
            <div style={{ fontSize: '9px' }} className="opacity-75 text-uppercase">Hệ thống quản lý địa chính</div>
          </div>
        </div>

        <div className="d-flex align-items-center text-white position-relative" ref={dropdownRef}>
          <div className="position-relative me-4 cursor-pointer">
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: '10px', padding: '2px 5px' }}>2</span>
          </div>

          <div className="d-flex align-items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="me-3 text-end">
              <div className="fw-bold text-uppercase" style={{ fontSize: '14px' }}>{user?.fullName || 'Cán bộ địa chính'}</div>
              <div style={{ fontSize: '11px' }} className="text-warning fw-bold">Cán bộ địa chính</div>
            </div>
            <div style={styles.avatarWrapper}>
              <img src="https://upload.wikimedia.org/wikipedia/vi/a/ad/VNeID_logo.webp" alt="avatar" style={styles.avatarImage} />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="shadow-lg border-0" style={styles.dropdownMenu}>
              <div className="list-group list-group-flush text-start">
                <button className="list-group-item list-group-item-action border-0 py-3 small" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-3"></i> Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div style={styles.bodyContainer}>
        <nav style={styles.sidebar}>
          <div style={{ padding: '15px 12px' }}>
            <NavItem
              active={location.pathname === '/cadastral/dashboard'}
              icon="bi-grid-3x3-gap-fill"
              label="Bảng điều khiển"
              onClick={() => navigate('/cadastral/dashboard')}
            />
            <NavItem
              active={location.pathname === '/cadastral/land-registry'}
              icon="bi-map-fill"
              label="Sổ địa chính"
              onClick={() => navigate('/cadastral/land-registry')}
            />
            <NavItem
              active={location.pathname === '/cadastral/dossier-processing'}
              icon="bi-file-earmark-text-fill"
              label="Xử lý hồ sơ"
              onClick={() => navigate('/cadastral/dossier-processing')}
            />
            <NavItem
              active={location.pathname === '/cadastral/land-price-management'}
              icon="bi-cash-coin"
              label="Quản lý giá đất"
              onClick={() => navigate('/cadastral/land-price-management')}
            />
            <NavItem
              active={location.pathname === '/cadastral/complaint-handling'}
              icon="bi-exclamation-triangle-fill"
              label="Xử lý khiếu nại"
              onClick={() => navigate('/cadastral/complaint-handling')}
            />
            <NavItem
              active={location.pathname === '/cadastral/report-stats'}
              icon="bi-bar-chart-fill"
              label="Báo cáo thống kê"
              onClick={() => navigate('/cadastral/report-stats')}
            />
          </div>
        </nav>

        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick, badge }) => (
  <div
    onClick={onClick}
    style={{
      ...styles.navItem,
      ...(active ? styles.navItemActive : {})
    }}
    className="cursor-pointer mb-1"
  >
    <div style={active ? styles.iconWrapperActive : styles.iconWrapper}>
      <i className={`bi ${icon} fs-5`} style={{ color: active ? '#1565c0' : '#6c757d' }}></i>
    </div>
    <span style={{
      fontSize: '15px',
      fontWeight: active ? '600' : '500',
      color: active ? '#1565c0' : '#333',
      flex: 1,
      marginLeft: '12px'
    }}>
      {label}
    </span>
    {badge && (
      <span className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: '12px' }}>
        {badge}
      </span>
    )}
  </div>
);

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' },
  header: { height: '70px', backgroundColor: '#1565c0', borderBottom: '2px solid #ffc107', flexShrink: 0, zIndex: 1001 },
  bodyContainer: { display: 'flex', flex: 1, backgroundColor: '#f8f9fa', overflow: 'hidden' },
  sidebar: {
    width: '260px',
    backgroundColor: '#fff',
    margin: '15px 0 15px 15px',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  navItemActive: {
    backgroundColor: '#e8f0fe',
    border: '1px solid #bbdefb',
  },
  iconWrapper: {
    width: '38px', height: '38px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', borderRadius: '10px', backgroundColor: '#f8f9fa',
  },
  iconWrapperActive: {
    width: '38px', height: '38px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', borderRadius: '10px', backgroundColor: '#bbdefb',
  },
  content: { flex: 1, padding: '25px', overflowY: 'auto' },
  avatarWrapper: { width: '42px', height: '42px', backgroundColor: '#fff', borderRadius: '50%', border: '2px solid #ffc107', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '3px' },
  avatarImage: { width: '100%', height: '100%', objectFit: 'contain' },
  dropdownMenu: { position: 'absolute', top: '65px', right: '20px', width: '200px', backgroundColor: '#fff', borderRadius: '15px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' },
};

export default CadastralLayout;
