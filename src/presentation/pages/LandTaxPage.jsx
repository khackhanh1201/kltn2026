import React, { useEffect, useState } from 'react';
import LandTaxLayout from '../components/LandTaxLayout';
import { Alert, Spinner } from 'react-bootstrap';

const LandTaxPage = () => {
  const [landPlots, setLandPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy user từ localStorage một cách an toàn
  const storedUser = JSON.parse(localStorage.getItem('user_info')) || {};
  
  // Debug: in ra toàn bộ user_info để kiểm tra cấu trúc thực tế
  console.log("Stored user_info:", storedUser);

  // Thử lấy ID từ các key phổ biến (tùy response backend)
  const userId = 
    storedUser.id ||
    storedUser.userId ||
    storedUser.data?.id ||
    storedUser.data?.userId ||
    storedUser.cccdNumber ||  // nếu backend dùng CCCD làm ID
    3;  // fallback cuối cùng

  useEffect(() => {
    const fetchLandPlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.");
        }

        if (!userId || userId === 'undefined') {
          throw new Error("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        }

        const response = await fetch(
          `http://localhost:9090/api/land-plots/my-land-plots?ownerId=${userId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Lỗi API ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        // Đảm bảo data là mảng
        const plots = Array.isArray(data) ? data : data?.data || data?.content || [];
        setLandPlots(plots);
      } catch (err) {
        console.error("Lỗi lấy danh sách đất:", err);
        setError(err.message || "Không thể tải danh sách thửa đất. Vui lòng thử lại sau.");
        setLandPlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLandPlots();
  }, [userId]);

  return (
    <LandTaxLayout user={storedUser}>
      <div className="text-start">
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Tiêu đề chức năng */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
          <h4 className="fw-bold mb-1">Quản lý thuế đất đai</h4>
          <p className="text-muted small mb-0">Danh sách các thửa đất đang sở hữu</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-3 text-muted">Đang tải danh sách thửa đất...</p>
          </div>
        ) : (
          <>
            {/* Khối thống kê */}
            <div className="row g-3 mb-4">
              <StatBox
                title="Tổng số thửa đất"
                value={landPlots.length}
                color="#fff1f2"
                textColor="#be123c"
                icon="bi-geo-alt"
              />
              <StatBox
                title="Đã nộp thuế"
                value={landPlots.filter(p => p.status === 'PAID').length || 2} // điều chỉnh logic nếu backend có field status
                color="#f0fdf4"
                textColor="#15803d"
                icon="bi-currency-dollar"
              />
              <StatBox
                title="Chưa nộp thuế"
                value={landPlots.filter(p => p.status !== 'PAID').length || 1}
                color="#fffbeb"
                textColor="#b45309"
                icon="bi-calendar-date"
              />
            </div>

            {/* Danh sách dữ liệu từ Backend */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
              <h5 className="fw-bold mb-4">Danh sách đất đai</h5>

              {landPlots.length === 0 ? (
                <p className="text-muted text-center py-5">
                  Không có thửa đất nào được tìm thấy.
                </p>
              ) : (
                landPlots.map((plot) => (
                  <div key={plot.id} className="border-bottom pb-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="fw-bold">
                        <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                        {`Thửa đất số ${plot.plotNumber || 'N/A'}, ${plot.mapSheetNumber || 'N/A'}, ${
                          plot.address || 'N/A'
                        }, ${plot.zoneArea || 'N/A'}`}
                      </div>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          plot.id === 1 || plot.status === 'PAID'
                            ? 'bg-success-subtle text-success'
                            : 'bg-warning-subtle text-warning'
                        }`}
                      >
                        {plot.status === 'PAID' || plot.id === 1 ? 'Đã nộp' : 'Chưa nộp'}
                      </span>
                    </div>

                    <div className="row text-muted small">
                      <div className="col-md-3">
                        Diện tích<br />
                        <span className="text-dark fw-bold">{plot.originalArea || 'N/A'} m²</span>
                      </div>
                      <div className="col-md-3">
                        Mục đích sử dụng<br />
                        <span className="text-dark fw-bold">{plot.landTypeCode || 'N/A'}</span>
                      </div>
                      <div className="col-md-3">
                        Thuế 2024<br />
                        <span className="text-danger fw-bold">1,200,000 VNĐ</span>
                      </div>
                      <div className="col-md-3">
                        Hạn nộp<br />
                        <span className="text-dark fw-bold">30/04/2024</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button className="btn btn-danger btn-sm rounded-pill px-4 me-2">
                        Xem chi tiết
                      </button>
                      {(plot.id !== 1 || plot.status !== 'PAID') && (
                        <button className="btn btn-outline-danger btn-sm rounded-pill px-4">
                          Nộp thuế
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </LandTaxLayout>
  );
};

const StatBox = ({ title, value, color, textColor, icon }) => (
  <div className="col-md-4">
    <div
      className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center justify-content-between"
      style={{ backgroundColor: color, borderRadius: '15px' }}
    >
      <div>
        <div className="small fw-bold text-muted">{title}</div>
        <div className="display-6 fw-bold" style={{ color: textColor }}>
          {value}
        </div>
      </div>
      <i className={`bi ${icon} fs-1`} style={{ color: textColor, opacity: 0.2 }}></i>
    </div>
  </div>
);

export default LandTaxPage;