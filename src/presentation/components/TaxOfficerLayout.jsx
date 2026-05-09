import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TaxOfficerLayout = ({ children, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      {/* ================= HEADER ================= */}
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
              CỔNG CÁN BỘ THUẾ
            </div>

            <div
              style={{ fontSize: '10px' }}
              className="opacity-75 text-uppercase"
            >
              Hệ thống quản lý thuế đất đai
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
              style={{
                fontSize: '10px',
                padding: '2px 5px',
              }}
            >
              5
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
                {user?.fullName || 'CÁN BỘ THUẾ'}
              </div>

              <div
                style={{ fontSize: '11px' }}
                className="text-warning fw-bold"
              >
                Tax Officer
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
                  onClick={() => navigate('/account')}
                >
                  <i className="bi bi-person-circle me-3"></i>
                  Tài khoản
                </button>

                <button
                  className="list-group-item list-group-item-action border-0 py-3 small text-danger"
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

      {/* ================= BODY ================= */}
      <div style={styles.bodyContainer}>
        {/* ================= SIDEBAR ================= */}
        <nav style={styles.sidebar}>
          <div style={{ padding: '18px 14px' }}>
            <NavItem
              active={location.pathname === '/tax-officer/dashboard'}
              icon="bi-grid"
              label="Bảng điều khiển"
              onClick={() => navigate('/tax-officer/dashboard')}
            />

            <NavItem
              active={location.pathname === '/tax-officer/tax-records'}
              icon="bi-folder"
              label="Hồ sơ thuế"
              onClick={() => navigate('/tax-officer/tax-records')}
            />

            <NavItem
              active={location.pathname === '/tax-officer/process-tax'}
              icon="bi-clipboard-check"
              label="Xử lý khai thuế"
              badge="5"
              onClick={() => navigate('/tax-officer/process-tax')}
            />

            <NavItem
              active={location.pathname === '/tax-officer/payments'}
              icon="bi-credit-card-2-front"
              label="Quản lý thanh toán"
              onClick={() => navigate('/tax-officer/payments')}
            />

            <NavItem
              active={location.pathname === '/tax-officer/complaints'}
              icon="bi-scales"
              label="Xử lý khiếu nại"
              onClick={() => navigate('/tax-officer/complaints')}
            />

            <NavItem
              active={location.pathname === '/tax-officer/reports'}
              icon="bi-bar-chart"
              label="Báo cáo thống kê"
              onClick={() => navigate('/tax-officer/reports')}
            />

            <NavItem
              active={location.pathname === '/account'}
              icon="bi-person-circle"
              label="Tài khoản"
              onClick={() => navigate('/account')}
            />
          </div>
        </nav>

        {/* ================= CONTENT ================= */}
        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
};

/* ================= NAV ITEM ================= */

const NavItem = ({
  active,
  icon,
  label,
  onClick,
  badge,
}) => (
  <div
    onClick={onClick}
    style={{
      ...styles.navItem,
      ...(active ? styles.navItemActive : {}),
    }}
    className="mb-2"
  >
    <div style={styles.iconWrapper}>
      <i
        className={`bi ${icon}`}
        style={{
          fontSize: '20px',
          color: active ? '#ffffff' : '#667085',
        }}
      ></i>
    </div>

    <span
      style={{
        marginLeft: '14px',
        fontSize: '15px',
        fontWeight: active ? '700' : '500',
        color: active ? '#ffffff' : '#475467',
        flex: 1,
      }}
    >
      {label}
    </span>

    {badge && (
      <span
        style={{
          backgroundColor: active ? '#ffffff' : '#c5161d',
          color: active ? '#c5161d' : '#ffffff',
          minWidth: '24px',
          height: '24px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '700',
        }}
      >
        {badge}
      </span>
    )}
  </div>
);

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },

  header: {
    height: '70px',
    backgroundColor: '#b91c1c',
    borderBottom: '2px solid #fbbf24',
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
    borderRight: '1px solid #e5e7eb',
    overflowY: 'auto',
  },

  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    backgroundColor: '#f8fafc',
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  navItemActive: {
    backgroundColor: '#c5161d',
  },

  iconWrapper: {
    width: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarWrapper: {
    width: '42px',
    height: '42px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    border: '2px solid #fbbf24',
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
    right: '0',
    width: '220px',
    backgroundColor: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    zIndex: 1000,
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
  },
};

export default TaxOfficerLayout;