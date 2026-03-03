import React, { useState } from 'react';
import LandTaxLayout from '../components/LandTaxLayout';
import { useNavigate } from 'react-router-dom';

const PropertyDeclarationPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_info')) || { id: 3, fullName: 'MAI NHƯ YẾN' };
  
  // State quản lý form dựa trên PropertyDeclarationEntity
  const [formData, setFormData] = useState({
    userId: user.id,
    landPlotId: '', // ID thửa đất chọn từ danh sách
    fiscalYear: new Date().getFullYear(),
    declaredArea: '',
    usagePurpose: 'Đất ở',
    fullName: user.fullName,
    identityNumber: user.citizenId, // Ví dụ
    address: '',
    certificateNumber: '',
    issueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API submit declaration
      const response = await fetch('http://localhost:9090/api/property-declarations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId,
          landPlotId: 1, // Giả định ID thửa đất đang chọn
          fiscalYear: formData.fiscalYear,
          declaredArea: parseFloat(formData.declaredArea),
          usagePurpose: formData.usagePurpose
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Gửi hồ sơ thành công! Mã hồ sơ: ${result.declarationId}`); //
        navigate('/land-tax');
      }
    } catch (error) {
      console.error("Lỗi gửi hồ sơ:", error);
    }
  };

  return (
    <LandTaxLayout user={user}>
      <div className="text-start">
        {/* Tiêu đề trang */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
          <h4 className="fw-bold mb-1">Kê khai đất đai</h4>
          <p className="text-muted small mb-0">Đăng ký thông tin đất đai mới hoặc cập nhật thông tin</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Thông tin chủ sở hữu */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
            <h6 className="fw-bold mb-4 border-bottom pb-2">Thông tin chủ sở hữu</h6>
            <div className="row g-3">
              <div className="col-md-6 text-start">
                <label className="form-label small fw-bold">Họ và tên <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Nhập họ và tên" required />
              </div>
              <div className="col-md-6 text-start">
                <label className="form-label small fw-bold">Số định danh cá nhân <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="identityNumber" value={formData.identityNumber} onChange={handleChange} placeholder="Nhập số định danh" required />
              </div>
            </div>
          </div>

          {/* Thông tin đất đai */}
          <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '15px' }}>
            <h6 className="fw-bold mb-4 border-bottom pb-2">Thông tin đất đai</h6>
            <div className="row g-3">
              <div className="col-12 text-start">
                <label className="form-label small fw-bold">Địa chỉ thửa đất <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="address" onChange={handleChange} placeholder="Nhập địa chỉ đầy đủ" required />
              </div>
              <div className="col-md-6 text-start">
                <label className="form-label small fw-bold">Diện tích (m²) <span className="text-danger">*</span></label>
                <input type="number" className="form-control form-control-sm" name="declaredArea" onChange={handleChange} placeholder="Nhập diện tích" required />
              </div>
              <div className="col-md-6 text-start">
                <label className="form-label small fw-bold">Loại đất <span className="text-danger">*</span></label>
                <select className="form-select form-select-sm" name="usagePurpose" value={formData.usagePurpose} onChange={handleChange}>
                  <option value="ODT">Đất ở tại đô thị (ODT)</option>
                  <option value="CLN">Đất trồng cây lâu năm (CLN)</option>
                </select>
              </div>
              <div className="col-12 text-start">
                <label className="form-label small fw-bold">Mục đích sử dụng <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="usagePurposeNote" onChange={handleChange} placeholder="Nhập mục đích sử dụng" />
              </div>
              <div className="col-md-6 text-start">
                <label className="form-label small fw-bold">Số giấy chứng nhận</label>
                <input type="text" className="form-control form-control-sm" name="certificateNumber" onChange={handleChange} placeholder="Nhập số giấy chứng nhận" />
              </div>
              <div className="col-md-6 text-start">
                <label className="form-label small fw-bold">Ngày cấp</label>
                <input type="date" className="form-control form-control-sm" name="issueDate" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Nút thao tác */}
          <div className="d-flex gap-2 mb-5">
            <button type="submit" className="btn btn-danger px-4 rounded-pill fw-bold">Gửi hồ sơ kê khai</button>
            <button type="reset" className="btn btn-outline-secondary px-4 rounded-pill fw-bold" onClick={() => setFormData({...formData, address: '', declaredArea: '', certificateNumber: ''})}>Làm mới</button>
          </div>
        </form>
      </div>
    </LandTaxLayout>
  );
};

export default PropertyDeclarationPage;