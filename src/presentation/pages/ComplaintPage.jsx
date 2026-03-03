import React, { useState, useEffect } from 'react';
import LandTaxLayout from '../components/LandTaxLayout';

const ComplaintPage = () => {
  const user = JSON.parse(localStorage.getItem('user_info')) || { id: 3, fullName: 'MAI NHƯ YẾN' };
  const [landPlots, setLandPlots] = useState([]);
  const [formData, setFormData] = useState({
    complaintType: '',
    landPlotId: '',
    title: '',
    content: '',
    phoneNumber: '',
    email: '',
  });

  // Lấy danh sách thửa đất của người dùng để chọn trong khiếu nại
  useEffect(() => {
    fetch(`http://localhost:9090/api/land-plots/my-land-plots?ownerId=${user.id}`)
      .then(res => res.json())
      .then(data => setLandPlots(data))
      .catch(err => console.error("Lỗi lấy danh sách thửa đất:", err));
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi dữ liệu khiếu nại lên Server
      const response = await fetch('http://localhost:9090/api/property-declarations/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          landPlotId: formData.landPlotId,
          content: `[${formData.complaintType} - ${formData.title}] ${formData.content}`,
        })
      });

      if (response.ok) {
        alert("Gửi khiếu nại thành công! Chúng tôi sẽ phản hồi trong vòng 15 ngày làm việc.");
      }
    } catch (error) {
      console.error("Lỗi gửi khiếu nại:", error);
    }
  };

  return (
    <LandTaxLayout user={user}>
      <div className="text-start">
        {/* Tiêu đề trang chuẩn mẫu */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
          <h4 className="fw-bold mb-1">Khiếu nại thuế đất đai</h4>
          <p className="text-muted small mb-0">Gửi khiếu nại về thông tin thuế đất đai</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
            <div className="row g-4">
              {/* Loại khiếu nại */}
              <div className="col-md-12">
                <label className="form-label small fw-bold">Loại khiếu nại <span className="text-danger">*</span></label>
                <select className="form-select" required onChange={(e) => setFormData({...formData, complaintType: e.target.value})}>
                  <option value="">-- Chọn loại khiếu nại --</option>
                  <option value="Sai lệch diện tích">Sai lệch diện tích</option>
                  <option value="Sai mức thuế">Sai mức thuế/Đơn giá</option>
                  <option value="Thông tin chủ sở hữu">Thông tin chủ sở hữu chưa chính xác</option>
                </select>
              </div>

              {/* Chọn thửa đất liên quan */}
              <div className="col-md-12">
                <label className="form-label small fw-bold">Thửa đất liên quan <span className="text-danger">*</span></label>
                <select className="form-select" required onChange={(e) => setFormData({...formData, landPlotId: e.target.value})}>
                  <option value="">-- Chọn thửa đất --</option>
                  {landPlots.map(plot => (
                    <option key={plot.id} value={plot.id}>{`Thửa ${plot.plotNumber} - Tờ ${plot.mapSheetNumber} (${plot.address})`}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label small fw-bold">Tiêu đề khiếu nại <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="Nhập tiêu đề khiếu nại" required 
                       onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="col-md-12">
                <label className="form-label small fw-bold">Nội dung khiếu nại <span className="text-danger">*</span></label>
                <textarea className="form-control" rows="5" placeholder="Mô tả chi tiết nội dung khiếu nại của bạn..." required
                          onChange={(e) => setFormData({...formData, content: e.target.value})}></textarea>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Số điện thoại liên hệ <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="Nhập số điện thoại" required />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Email liên hệ</label>
                <input type="email" className="form-control" placeholder="Nhập email" />
              </div>

              {/* Tải tài liệu đính kèm */}
              <div className="col-md-12">
                <label className="form-label small fw-bold">Tài liệu đính kèm</label>
                <div className="border border-dashed rounded-3 p-4 text-center bg-light">
                  <i className="bi bi-file-earmark-arrow-up fs-2 text-muted"></i>
                  <p className="mb-0 small text-muted">Nhấn để chọn file hoặc kéo thả file vào đây</p>
                  <p className="text-muted" style={{fontSize: '10px'}}>PDF, JPG, PNG (Tối đa 10MB)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button type="submit" className="btn btn-danger px-4 rounded-pill fw-bold">Gửi khiếu nại</button>
            <button type="button" className="btn btn-outline-secondary px-4 rounded-pill fw-bold">Hủy bỏ</button>
          </div>
        </form>

        {/* Lưu ý gửi khiếu nại */}
        <div className="alert alert-primary border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#e7f1ff' }}>
          <h6 className="fw-bold"><i className="bi bi-info-circle-fill me-2"></i>Lưu ý khi gửi khiếu nại</h6>
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