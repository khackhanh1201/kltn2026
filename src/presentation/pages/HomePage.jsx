import React from 'react';
import MainLayout from '../components/MainLayout';

const HomePage = () => {
  // Giả sử lấy từ localStorage sau khi đăng nhập thành công
  const user = JSON.parse(localStorage.getItem('user_info'));

  return (
    <MainLayout user={user}>
      {/* Banner Section */}
      <div className="mb-4 shadow-sm" style={styles.banner}>
        <div style={styles.bannerOverlay}>
          <h1 className="display-4 fw-light italic" style={{fontFamily: 'cursive'}}>Welcome to Viet Nam</h1>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="card border-0 shadow-sm p-4 mb-4" style={{borderRadius: '20px'}}>
        <h3 className="fw-bold">Chào buổi tối, {user.fullName}!</h3>
        <p className="text-muted mb-0">Chào mừng bạn đến với Trang thông tin định danh điện tử</p>
      </div>

      {/* Grid Menu */}
      <div className="row g-4">
        <MenuCard title="Tin tức - Sự kiện" desc="Tin tức nổi bật mới nhất trong ngày" icon="bi-file-earmark-text" color="#ffc107" />
        <MenuCard title="Cảnh báo lừa đảo" desc="Cảnh báo lừa đảo mới nhất trong ngày" icon="bi-shield-exclamation" color="#ffc107" />
        <MenuCard title="Câu hỏi thường gặp" desc="Những thắc mắc của người dùng về ứng dụng VNeID" icon="bi-question-circle" color="#ffc107" />
      </div>
    </MainLayout>
  );
};

// Component con cho các thẻ menu
const MenuCard = ({ title, desc, icon, color }) => (
  <div className="col-md-4">
    <div className="card border-0 shadow-sm h-100 p-4" style={{borderRadius: '20px', position: 'relative'}}>
      <h5 className="fw-bold">{title}</h5>
      <p className="small text-muted mb-4">{desc}</p>
      <div className="mt-auto d-flex justify-content-between align-items-center">
        <span className="text-danger fw-bold small cursor-pointer">Xem ngay</span>
        <i className={`bi ${icon}`} style={{fontSize: '40px', color: color, opacity: 0.8}}></i>
      </div>
    </div>
  </div>
);

const styles = {
  banner: {
    height: '250px',
    borderRadius: '25px',
    backgroundImage: `url('https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    position: 'relative'
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  }
};

export default HomePage;