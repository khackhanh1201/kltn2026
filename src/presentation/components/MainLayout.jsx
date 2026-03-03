import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLayout = ({ children, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Đóng dropdown khi nhấn ra ngoài
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
      {/* Header đỏ chuẩn VNeID */}
      <header style={styles.header} className="d-flex justify-content-between align-items-center px-4">
        <div className="d-flex align-items-center">
          <img src="https://vneid.gov.vn/_next/static/media/logo-full-vneid.c28b5b54.png" alt="logo" style={{height: '35px'}} />
          <div className="ms-3 text-white text-start d-none d-md-block">
            <div className="fw-bold" style={{fontSize: '13px', lineHeight: '1.2'}}>BỘ CÔNG AN</div>
            <div style={{fontSize: '9px'}} className="opacity-75 text-uppercase">Trung tâm dữ liệu quốc gia về dân cư</div>
          </div>
        </div>
        
        <div className="d-flex align-items-center text-white position-relative" ref={dropdownRef}>
          {/* Badge thông báo số 2 */}
          <div className="position-relative me-4 cursor-pointer">
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{fontSize: '10px', padding: '2px 5px'}}>2</span>
          </div>

          <div className="d-flex align-items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="me-3 text-end">
              <div className="fw-bold text-uppercase" style={{fontSize: '14px'}}>{user?.fullName || 'NGUYỄN VĂN TEST'}</div>
              <div style={{fontSize: '11px'}} className="text-warning fw-bold">Định danh mức 2</div>
            </div>
            <div style={styles.avatarWrapper}>
               <img src="https://upload.wikimedia.org/wikipedia/vi/a/ad/VNeID_logo.webp" alt="avatar" style={styles.avatarImage} />
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="shadow-lg border-0" style={styles.dropdownMenu}>
              <div className="p-3 border-bottom d-flex align-items-center">
                <div className="me-3 flex-grow-1 text-start">
                  <div className="fw-bold text-dark">{user?.fullName || 'MAI NHƯ YẾN'}</div>
                  <div className="small text-muted">
                    Định danh mức 2 <i className="bi bi-shield-check-fill text-danger"></i>
                  </div>
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/vi/a/ad/VNeID_logo.webp" alt="avatar" style={{width: '45px', height: '45px'}} />
              </div>
              
              <div className="list-group list-group-flush text-start">
                <button className="list-group-item list-group-item-action border-0 py-3 small"><i className="bi bi-key me-3"></i> Đổi mật khẩu</button>
                <button className="list-group-item list-group-item-action border-0 py-3 small"><i className="bi bi-shield-lock me-3"></i> Đổi passcode</button>
                <button className="list-group-item list-group-item-action border-0 py-3 small text-danger"><i className="bi bi-slash-circle me-3"></i> Yêu cầu khóa tài khoản</button>
                <button className="list-group-item list-group-item-action border-0 py-3 small"><i className="bi bi-person-gear me-3"></i> Đổi tài khoản</button>
                <button className="list-group-item list-group-item-action border-0 py-3 small" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-3"></i> Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div style={styles.bodyContainer}>
        {/* Sidebar Trang chủ - ĐÃ FIX ONCLICK ĐỂ CHUYỂN TRANG */}
        <nav style={styles.sidebar}>
          <div className="d-flex flex-column h-100 w-100">
            <NavItem 
              active={location.pathname === '/home'} 
              icon="bi-house" 
              label="Trang chủ" 
              onClick={() => navigate('/home')} 
            />
            <NavItem 
              active={location.pathname === '/land-tax'} 
              icon="bi-map" 
              label="Thuế đất đai" 
              onClick={() => navigate('/land-tax')} 
            />
            <NavItem icon="bi-newspaper" label="Tin tức" />
            <NavItem icon="bi-building" label="Tổ chức" />
            <NavItem icon="bi-gear" label="Cài đặt" />
          </div>
        </nav>

        {/* Nội dung trang chủ */}
        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
};

/**
 * Component NavItem: Đảm bảo nhận onClick và gắn vào thẻ div
 */
const NavItem = ({ active, icon, label, onClick }) => (
  <div 
    onClick={onClick} 
    style={{...styles.navItem, ...(active ? styles.navItemActive : {})}}
    className="cursor-pointer"
  >
    <div style={active ? styles.iconCircleActive : {}}>
        <i className={`bi ${icon}${active ? '-fill' : ''} ${active ? 'text-danger' : 'text-muted'} fs-3 mb-1`}></i>
    </div>
    <span style={{
        fontSize: '11px', 
        color: active ? '#a30d11' : '#6c757d', 
        fontWeight: active ? 'bold' : '500', 
        textAlign: 'center', 
        marginTop: '5px'
    }}>
        {label}
    </span>
  </div>
);

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' },
  header: { height: '70px', backgroundColor: '#a30d11', borderBottom: '2px solid #ffc107', flexShrink: 0, zIndex: 1001 },
  bodyContainer: { display: 'flex', flex: 1, backgroundColor: '#f4f1e9', overflow: 'hidden' },
  sidebar: { 
    width: '160px', 
    backgroundColor: '#fff', 
    borderRadius: '25px', 
    margin: '15px 0 15px 15px',
    display: 'flex', 
    flexDirection: 'column', 
    flexShrink: 0, 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '15px 5px', cursor: 'pointer', borderBottom: '1px solid #f8f9fa' },
  navItemActive: { 
    backgroundColor: '#fff5f5',
    color: '#a30d11'
  },
  iconCircleActive: { 
    width: '45px', 
    height: '45px', 
    backgroundColor: '#fdecef', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  content: { flex: 1, padding: '20px', overflowY: 'auto' },
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
    padding: '3px' 
  },
  avatarImage: { width: '100%', height: '100%', objectFit: 'contain' },
  dropdownMenu: { 
    position: 'absolute', 
    top: '65px', 
    right: '0', 
    width: '200px', 
    backgroundColor: '#fff', 
    borderRadius: '15px', 
    zIndex: 1000, 
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
  }
};

export default MainLayout;