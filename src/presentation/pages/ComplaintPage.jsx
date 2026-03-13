import React, { useState, useEffect } from 'react';
import LandTaxLayout from '../components/LandTaxLayout';
import { Alert, Spinner } from 'react-bootstrap';

const ComplaintPage = () => {
  const [landPlots, setLandPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    complaintType: '',
    landPlotId: '',
    title: '',
    content: '',
    phoneNumber: '',
    email: '',
  });

  // Lấy user từ localStorage
  const storedUser = JSON.parse(localStorage.getItem('user_info')) || {};
  
  // Debug: in ra toàn bộ để kiểm tra cấu trúc
  console.log("Stored user_info in ComplaintPage:", storedUser);

  // Lấy ID từ các key có thể có
  const userId = 
    storedUser.id ||
    storedUser.userId ||
    storedUser.data?.id ||
    storedUser.data?.userId ||
    storedUser.cccdNumber ||  // nếu dùng CCCD làm ID
    3;  // fallback

  // Lấy danh sách thửa đất
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
        // Đảm bảo là mảng
        const plots = Array.isArray(data) ? data : data?.data || data?.content || [];
        setLandPlots(plots);
      } catch (err) {
        console.error("Lỗi lấy danh sách thửa đất:", err);
        setError(err.message || "Không thể tải danh sách thửa đất để chọn.");
        setLandPlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLandPlots();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      const response = await fetch('http://localhost:9090/api/property-declarations/complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          landPlotId: formData.landPlotId,
          content: `[${formData.complaintType} - ${formData.title}] ${formData.content}`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi gửi khiếu nại: ${errorText}`);
      }

      alert("Gửi khiếu nại thành công! Chúng tôi sẽ phản hồi trong vòng 15 ngày làm việc.");
      // Reset form nếu cần
      setFormData({
        complaintType: '',
        landPlotId: '',
        title: '',
        content: '',
        phoneNumber: '',
        email: '',
      });
    } catch (error) {
      console.error("Lỗi gửi khiếu nại:", error);
      setError(error.message || "Gửi khiếu nại thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <LandTaxLayout user={storedUser}>
      <div className="text-start">
        {/* Hiển thị lỗi chung */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Tiêu đề */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
          <h4 className="fw-bold mb-1">Khiếu nại thuế đất đai</h4>
          <p className="text-muted small mb-0">Gửi khiếu nại về thông tin thuế đất đai</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-3 text-muted">Đang tải danh sách thửa đất...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
              <div className="row g-4">
                {/* Loại khiếu nại */}
                <div className="col-md-12">
                  <label className="form-label small fw-bold">
                    Loại khiếu nại <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    required
                    value={formData.complaintType}
                    onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
                  >
                    <option value="">-- Chọn loại khiếu nại --</option>
                    <option value="Sai lệch diện tích">Sai lệch diện tích</option>
                    <option value="Sai mức thuế">Sai mức thuế/Đơn giá</option>
                    <option value="Thông tin chủ sở hữu">Thông tin chủ sở hữu chưa chính xác</option>
                  </select>
                </div>

                {/* Chọn thửa đất */}
                <div className="col-md-12">
                  <label className="form-label small fw-bold">
                    Thửa đất liên quan <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    required
                    value={formData.landPlotId}
                    onChange={(e) => setFormData({ ...formData, landPlotId: e.target.value })}
                  >
                    <option value="">-- Chọn thửa đất --</option>
                    {landPlots.length > 0 ? (
                      landPlots.map((plot) => (
                        <option key={plot.id} value={plot.id}>
                          {`Thửa ${plot.plotNumber || 'N/A'} - Tờ ${plot.mapSheetNumber || 'N/A'} (${
                            plot.address || 'N/A'
                          })`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Không có thửa đất nào
                      </option>
                    )}
                  </select>
                </div>

                {/* Tiêu đề */}
                <div className="col-md-12">
                  <label className="form-label small fw-bold">
                    Tiêu đề khiếu nại <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tiêu đề khiếu nại"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Nội dung */}
                <div className="col-md-12">
                  <label className="form-label small fw-bold">
                    Nội dung khiếu nại <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Mô tả chi tiết nội dung khiếu nại của bạn..."
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  ></textarea>
                </div>

                {/* SĐT & Email */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    Số điện thoại liên hệ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Email liên hệ</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* File đính kèm (chưa xử lý upload, chỉ UI) */}
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Tài liệu đính kèm</label>
                  <div className="border border-dashed rounded-3 p-4 text-center bg-light">
                    <i className="bi bi-file-earmark-arrow-up fs-2 text-muted"></i>
                    <p className="mb-0 small text-muted">Nhấn để chọn file hoặc kéo thả file vào đây</p>
                    <p className="text-muted" style={{ fontSize: '10px' }}>
                      PDF, JPG, PNG (Tối đa 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mb-4">
              <button type="submit" className="btn btn-danger px-4 rounded-pill fw-bold">
                Gửi khiếu nại
              </button>
              <button type="button" className="btn btn-outline-secondary px-4 rounded-pill fw-bold">
                Hủy bỏ
              </button>
            </div>
          </form>
        )}

        {/* Lưu ý */}
        <div className="alert alert-primary border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#e7f1ff' }}>
          <h6 className="fw-bold">
            <i className="bi bi-info-circle-fill me-2"></i>Lưu ý khi gửi khiếu nại
          </h6>
          <ul className="small mb-0 mt-2">
            <li>Khiếu nại sẽ được xử lý trong vòng 15 ngày làm việc.</li>
            <li>Vui lòng cung cấp đầy đủ thông tin và tài liệu liên quan.</li>
            <li>Bạn sẽ nhận được thông báo qua email và SMS khi có kết quả.</li>
            <li>Liên hệ hotline 1900-xxxx để được hỗ trợ thêm.</li>
          </ul>
        </div>
      </div>
    </LandTaxLayout>
  );
};

export default ComplaintPage;