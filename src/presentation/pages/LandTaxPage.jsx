import React, { useEffect, useState } from 'react';
import LandTaxLayout from '../components/LandTaxLayout';

const LandTaxPage = () => {
  const [landPlots, setLandPlots] = useState([]);
  const user = JSON.parse(localStorage.getItem('user_info')) || { id: 3 };

  useEffect(() => {
    // Gọi API lấy danh sách đất
    fetch(`http://localhost:9090/api/land-plots/my-land-plots?ownerId=${user.id}`)
      .then(res => res.json())
      .then(data => setLandPlots(data))
      .catch(err => console.error("Lỗi:", err));
  }, [user.id]);

  return (
    <LandTaxLayout user={user}>
      <div className="text-start">
        {/* Tiêu đề chức năng */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{borderRadius: '15px'}}>
          <h4 className="fw-bold mb-1">Quản lý thuế đất đai</h4>
          <p className="text-muted small mb-0">Danh sách các thửa đất đang sở hữu</p>
        </div>

        {/* Khối thống kê */}
        <div className="row g-3 mb-4">
          <StatBox title="Tổng số thửa đất" value={landPlots.length} color="#fff1f2" textColor="#be123c" icon="bi-geo-alt" />
          <StatBox title="Đã nộp thuế" value="2" color="#f0fdf4" textColor="#15803d" icon="bi-currency-dollar" />
          <StatBox title="Chưa nộp thuế" value="1" color="#fffbeb" textColor="#b45309" icon="bi-calendar-date" />
        </div>

        {/* Danh sách dữ liệu từ Backend */}
        <div className="card border-0 shadow-sm p-4" style={{borderRadius: '15px'}}>
          <h5 className="fw-bold mb-4">Danh sách đất đai</h5>
          {landPlots.map(plot => (
            <div key={plot.id} className="border-bottom pb-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="fw-bold">
                  <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                  {`Thửa đất số ${plot.plotNumber}, ${plot.mapSheetNumber}, ${plot.address}, ${plot.zoneArea}`}
                </div>
                <span className={`badge rounded-pill px-3 py-2 ${plot.id === 1 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                  {plot.id === 1 ? 'Đã nộp' : 'Chưa nộp'}
                </span>
              </div>
              
              <div className="row text-muted small">
                <div className="col-md-3">Diện tích<br/><span className="text-dark fw-bold">{plot.originalArea} m²</span></div>
                <div className="col-md-3">Mục đích sử dụng<br/><span className="text-dark fw-bold">{plot.landTypeCode}</span></div>
                <div className="col-md-3">Thuế 2024<br/><span className="text-danger fw-bold">1,200,000 VNĐ</span></div>
                <div className="col-md-3">Hạn nộp<br/><span className="text-dark fw-bold">30/04/2024</span></div>
              </div>
              
              <div className="mt-3">
                <button className="btn btn-danger btn-sm rounded-pill px-4 me-2">Xem chi tiết</button>
                {plot.id !== 1 && <button className="btn btn-outline-danger btn-sm rounded-pill px-4">Nộp thuế</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LandTaxLayout>
  );
};

const StatBox = ({ title, value, color, textColor, icon }) => (
  <div className="col-md-4">
    <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center justify-content-between" style={{backgroundColor: color, borderRadius: '15px'}}>
      <div>
        <div className="small fw-bold text-muted">{title}</div>
        <div className="display-6 fw-bold" style={{color: textColor}}>{value}</div>
      </div>
      <i className={`bi ${icon} fs-1`} style={{color: textColor, opacity: 0.2}}></i>
    </div>
  </div>
);

export default LandTaxPage;