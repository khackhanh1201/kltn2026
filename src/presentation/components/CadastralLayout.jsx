import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CadastralOfficerLayout = ({ children, user }) => {
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      {/* HEADER */}
      <header
        style={styles.header}
        className="d-flex justify-content-between align-items-center px-4"
      >
        <div className="d-flex align-items-center">
          <img
            src="https://vneid.gov.vn/_next/static/media/logo-full-vneid.c28b5b54.png"
            alt="logo"
            style={{ height: '35px' }}
          />

          <div className="ms-3 text-white text-start d-none d-md-block">
            <div
              className="fw-bold"
              style={{ fontSize: '13px', lineHeight: '1.2' }}
            >
              BỘ TÀI NGUYÊN & MÔI TRƯỜNG
            </div>

            <div
              style={{ fontSize: '9px' }}
              className="opacity-75 text-uppercase"
            >
              Hệ thống quản lý địa chính số
            </div>
          </div>
        </div>

        {/* USER */}
        <div
          className="d-flex align-items-center text-white position-relative"
          ref={dropdownRef}
        >
          <div className="position-relative me-4 cursor-pointer">
            <i className="bi bi-bell fs-5"></i>

            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
              style={{ fontSize: '10px', padding: '2px 5px' }}
            >
              3
            </span>
          </div>

          <div
            className="d-flex align-items-center cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="me-3 text-end">
              <div
                className="fw-bold text-uppercase"
                style={{ fontSize: '14px' }}
              >
                {user?.fullName || 'CÁN BỘ ĐỊA CHÍNH'}
              </div>

              <div
                style={{ fontSize: '11px' }}
                className="text-warning fw-bold"
              >
                Cadastral Officer
              </div>
            </div>

            <div style={styles.avatarWrapper}>
              <img
                src="https://upload.wikimedia.org/wikipedia/vi/a/ad/VNeID_logo.webp"
                alt="avatar"
                style={styles.avatarImage}
              />
            </div>
          </div>

          {/* DROPDOWN */}
          {isDropdownOpen && (
            <div className="shadow-lg border-0" style={styles.dropdownMenu}>
              <div className="list-group list-group-flush text-start">
                <button
                  className="list-group-item list-group-item-action border-0 py-3 small"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-3"></i>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* BODY */}
      <div style={styles.bodyContainer}>
        {/* SIDEBAR */}
        <nav style={styles.sidebar}>
          <div style={{ padding: '15px 12px' }}>
            <NavItem
              active={
                location.pathname === '/cadastral-dashboard' ||
                location.pathname === '/dashboard'
              }
              icon="bi-grid-3x3-gap-fill"
              label="Bảng điều khiển"
              onClick={() => navigate('/cadastral-dashboard')}
            />

            <NavItem
              active={location.pathname === '/digital-cadastral-map'}
              icon="bi-map"
              label="Sổ địa chính số"
              onClick={() => navigate('/digital-cadastral-map')}
            />

            <NavItem
              active={location.pathname === '/land-price-management'}
              icon="bi-bank"
              label="Quản lý Giá đất"
              onClick={() => navigate('/land-price-management')}
            />

            <NavItem
              active={location.pathname === '/cadastral-records'}
              icon="bi-folder"
              label="Xử lý Hồ sơ"
              badge="3"
              onClick={() => navigate('/cadastral-records')}
            />

            <NavItem
              active={location.pathname === '/cadastral-complaints'}
              icon="bi-scales"
              label="Xử lý Khiếu nại"
              onClick={() => navigate('/cadastral-complaints')}
            />

            <NavItem
              active={location.pathname === '/cadastral-reports'}
              icon="bi-bar-chart-line"
              label="Báo cáo thống kê"
              onClick={() => navigate('/cadastral-reports')}
            />

            <NavItem
              active={location.pathname === '/account'}
              icon="bi-person-circle"
              label="Tài khoản"
              onClick={() => navigate('/account')}
            />
          </div>
        </nav>

        {/* CONTENT */}
        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
};

/* ======================== NAV ITEM ======================== */

const NavItem = ({ active, icon, label, onClick, badge }) => (
  <div
    onClick={onClick}
    style={{
      ...styles.navItem,
      ...(active ? styles.navItemActive : {}),
    }}
    className="cursor-pointer mb-2"
  >
    {/* ICON */}
    <div style={styles.iconContainer}>
      <i
        className={`bi ${icon}`}
        style={{
          fontSize: '22px',
          color: active ? '#ffffff' : '#5b6577',
        }}
      ></i>
    </div>

    {/* LABEL */}
    <span
      style={{
        fontSize: '17px',
        fontWeight: active ? '700' : '500',
        color: active ? '#ffffff' : '#5b6577',
        marginLeft: '14px',
        flex: 1,
      }}
    >
      {label}
    </span>

    {/* BADGE */}
    {badge && (
      <span
        className="badge rounded-pill"
        style={{
          backgroundColor: active ? '#ffffff' : '#c91d1d',
          color: active ? '#c91d1d' : '#ffffff',
          fontSize: '13px',
          minWidth: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
        }}
      >
        {badge}
      </span>
    )}
  </div>
);

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: '#f4f6f9',
  },

  header: {
    height: '70px',
    backgroundColor: '#b31217',
    borderBottom: '2px solid #ffc107',
    flexShrink: 0,
    zIndex: 1000,
  },

  bodyContainer: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  sidebar: {
    width: '320px',
    backgroundColor: '#ffffff',
    paddingTop: '5px',
    borderRight: '1px solid #edf0f5',
    overflowY: 'auto',
    flexShrink: 0,
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 18px',
    borderRadius: '16px',
    transition: 'all 0.25s ease',
  },

  navItemActive: {
    backgroundColor: '#c5161d',
    boxShadow: '0 6px 14px rgba(197,22,29,0.18)',
  },

  iconContainer: {
    width: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
  },

  avatarWrapper: {
    width: '42px',
    height: '42px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    border: '2px solid #ffc107',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '3px',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  dropdownMenu: {
    position: 'absolute',
    top: '65px',
    right: '20px',
    width: '200px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    zIndex: 1000,
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
  },
};

export default CadastralOfficerLayout;