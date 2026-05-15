import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LandTaxLayout = ({ children, user }) => { // Nếu đã truyền prop user thì dùng luôn
  // Nếu chưa có prop user, hãy tự đọc từ localStorage:
  const userInfoRaw = JSON.parse(localStorage.getItem('user_info') || '{}');
  const currentUser = user || userInfoRaw?.data || userInfoRaw;
  
  // Lấy tên, nếu không có thì để mặc định
  const displayName = currentUser?.fullName || currentUser?.full_name || 'Khách truy cập';
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            <div className="fw-bold" style={{ fontSize: '13px', lineHeight: '1.2' }}>BỘ CÔNG AN</div>
            <div style={{ fontSize: '9px' }} className="opacity-75 text-uppercase">Trung tâm dữ liệu quốc gia về dân cư</div>
          </div>
        </div>

        <div className="d-flex align-items-center text-white position-relative" ref={dropdownRef}>
          <div className="position-relative me-4 cursor-pointer">
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: '10px', padding: '2px 5px' }}>2</span>
          </div>

          <div className="d-flex align-items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="me-3 text-end">
              <div className="fw-bold text-uppercase" style={{ fontSize: '14px' }}>
  {user?.fullName || user?.full_name || user?.data?.fullName || user?.data?.full_name || 'NGƯỜI DÙNG'}
</div>
              <div style={{ fontSize: '11px' }} className="text-warning fw-bold">Định danh mức 2</div>
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
        {/* Sidebar đã được sửa: có bo góc + highlight đẹp khi active */}
        <nav style={styles.sidebar}>
          <div style={{ padding: '15px 12px' }}>
            <NavItem 
              active={location.pathname === '/land-tax' || location.pathname === '/home'} 
              icon="bi-grid-3x3-gap-fill" 
              label="Bảng điều khiển" 
              onClick={() => navigate('/land-tax')} 
            />

            <NavItem 
              active={location.pathname === '/land-information'} 
              icon="bi-info-circle-fill" 
              label="Thông tin đất đai" 
              onClick={() => navigate('/land-information')} 
            />

            <NavItem 
              active={location.pathname === '/tax'} 
              icon="bi-receipt-cutoff" 
              label="Thuế đất đai" 
              onClick={() => navigate('/tax')} 
            />

            <NavItem 
              active={location.pathname === '/property-declaration'} 
              icon="bi-folder2-open" 
              label="Hồ sơ khai báo" 
              onClick={() => navigate('/property-declaration')} 
              badge="1"
            />

            <NavItem 
              active={location.pathname === '/payment'} 
              icon="bi-credit-card-2-front" 
              label="Thanh toán" 
              onClick={() => navigate('/payment')} 
            />

            <NavItem 
              active={location.pathname === '/complaint'} 
              icon="bi-exclamation-triangle-fill" 
              label="Khiếu nại" 
              onClick={() => navigate('/complaint')} 
            />

            <NavItem 
              active={location.pathname === '/search'} 
              icon="bi-search" 
              label="Tra cứu" 
              onClick={() => navigate('/search')} 
            />

            <NavItem 
              active={location.pathname === '/account'} 
              icon="bi-person-circle" 
              label="Tài khoản" 
              onClick={() => navigate('/account')} 
            />
          </div>
        </nav>

        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
};

/* ====================== NavItem được nâng cấp ====================== */
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
      <i className={`bi ${icon} fs-5`} style={{ color: active ? '#a30d11' : '#6c757d' }}></i>
    </div>
    
    <span style={{
      fontSize: '15px',
      fontWeight: active ? '600' : '500',
      color: active ? '#a30d11' : '#333',
      flex: 1,
      marginLeft: '12px'
    }}>
      {label}
    </span>

    {badge && (
      <span className="badge bg-danger rounded-pill px-2 py-1" style={{ fontSize: '12px' }}>
        {badge}
      </span>
    )}
  </div>
);

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' },
  header: { height: '70px', backgroundColor: '#a30d11', borderBottom: '2px solid #ffc107', flexShrink: 0, zIndex: 1001 },
  bodyContainer: { display: 'flex', flex: 1, backgroundColor: '#f8f9fa', overflow: 'hidden' },

  /* Sidebar */
  sidebar: {
    width: '260px',
    backgroundColor: '#fff',
    margin: '15px 0 15px 15px',
    borderRadius: '20px',           // Bo góc cho toàn bộ sidebar
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    flexShrink: 0,
    alignSelf: 'stretch',
  },

  /* NavItem */
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    borderRadius: '12px',           // Bo góc cho từng mục
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  navItemActive: {
    backgroundColor: '#fff0f0',     // Nền hồng nhạt khi active
    border: '1px solid #ffcdd2',    // Viền nhẹ
  },

  iconWrapper: {
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
  },

  iconWrapperActive: {
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    backgroundColor: '#fdecef',     // Hồng nhạt đậm hơn khi active
  },

  content: { flex: 1, padding: '25px', overflowY: 'auto' },

  avatarWrapper: { width: '42px', height: '42px', backgroundColor: '#fff', borderRadius: '50%', border: '2px solid #ffc107', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '3px' },
  avatarImage: { width: '100%', height: '100%', objectFit: 'contain' },
  dropdownMenu: { position: 'absolute', top: '65px', right: '20px', width: '200px', backgroundColor: '#fff', borderRadius: '15px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' },
};

export default LandTaxLayout;