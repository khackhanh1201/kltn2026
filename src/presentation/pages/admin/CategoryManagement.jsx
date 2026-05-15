import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';

// --- MOCK DATA: Dựa chính xác vào bảng tax_exempt_subjects ---
const MOCK_EXEMPTIONS = [
  { citizen_id: 1, full_name: 'Nguyễn Văn Anh', exemption_reason: 'Thương binh', discount_rate: 50.00, applied_year: 2026 },
  { citizen_id: 2, full_name: 'Trần Thị Bình', exemption_reason: 'Mẹ VNAH', discount_rate: 100.00, applied_year: 2026 },
  { citizen_id: 3, full_name: 'Lê Hoàng Cường', exemption_reason: 'Hộ nghèo', discount_rate: 100.00, applied_year: 2026 },
  { citizen_id: 4, full_name: 'Phạm Quỳnh Dung', exemption_reason: 'Gia đình chính sách', discount_rate: 50.00, applied_year: 2026 },
];

const CategoryManagement = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  const fileInputRef = useRef(null);
  const baseUrl = 'http://localhost:8080'; // Cập nhật port backend của bạn

  // States
  const [regions, setRegions] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  const [isExemptModalOpen, setIsExemptModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  // Filter States cho Modal 1
  const [exemptSearch, setExemptSearch] = useState('');
  const [exemptType, setExemptType] = useState('Tất cả loại đối tượng');

  // Khởi chạy khi vào trang
  useEffect(() => {
    fetchRegions();
  }, []);

  // 1. LẤY DỮ LIỆU TỪ BẢNG `areas`
  const fetchRegions = async () => {
  setIsLoadingRegions(true);
  try {
    const token = localStorage.getItem('token');
    console.log('Fetching regions with token:', token ? 'YES' : 'NO');
    
    const res = await fetch(`${baseUrl}/api/master-data/areas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('API Response Status:', res.status);
    console.log('API Response OK:', res.ok);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✓ API Success - Full Response:', data);
      console.log('✓ data.data exists?', data.data ? 'YES' : 'NO');
      console.log('✓ data.data structure:', JSON.stringify(data.data, null, 2));
      
      const regionsData = data.data || data;
      console.log('✓ Setting regions to:', regionsData);
      setRegions(regionsData);
    } else {
      const errorText = await res.text();
      console.error('✗ API Failed - Status:', res.status, 'Response:', errorText);
      console.log('Falling back to mock data');
      setRegions([
        { area_id: 1, district_code: 'D001', ward_code: 'W001', street_name: 'Đường Nguyễn Trãi', position_level: 1, land_quota: 150.00 },
        { area_id: 2, district_code: 'D001', ward_code: 'W002', street_name: 'Đường Lê Lợi', position_level: 2, land_quota: 200.00 },
        { area_id: 3, district_code: 'D002', ward_code: 'W003', street_name: 'Đường Trần Hưng Đạo', position_level: 1, land_quota: 100.00 },
      ]);
    }
  } catch (err) {
    console.error('Network error:', err);
    console.log('Falling back to mock data due to error');
    setRegions([
      { area_id: 1, district_code: 'D001', ward_code: 'W001', street_name: 'Đường Nguyễn Trãi', position_level: 1, land_quota: 150.00 },
      { area_id: 2, district_code: 'D001', ward_code: 'W002', street_name: 'Đường Lê Lợi', position_level: 2, land_quota: 200.00 },
    ]);
  } finally {
    setIsLoadingRegions(false);
  }
};

  // 2. UPLOAD FILE VÀO BẢNG `tax_exempt_subjects`
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${baseUrl}/api/admin/exemptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setUploadMessage({ type: 'success', text: `Đã tải lên thành công file ${file.name}!` });
      } else {
        setUploadMessage({ type: 'danger', text: 'Tải lên thất bại. Vui lòng kiểm tra lại định dạng file.' });
      }
    } catch (err) {
      setUploadMessage({ type: 'danger', text: 'Lỗi kết nối đến máy chủ.' });
    } finally {
      setIsUploading(false);
      event.target.value = null; 
    }
  };

  const handleOpenConfig = (region) => {
    setSelectedRegion(region);
    setIsConfigModalOpen(true);
  };

  return (
    <AdminLayout user={user}>
      <div className="container py-4" style={{ maxWidth: '1140px' }}>
        
        {/* Header Section */}
        <div className="mb-4">
          <h3 className="fw-bold">Quản lý Danh mục</h3>
          <p className="text-muted">Quản lý các hạng mục gốc của hệ thống: Đối tượng miễn thuế, Hạn mức khu vực</p>
        </div>

        {/* Main Grid */}
        <div className="row g-4 mb-4">
          
          {/* Card 1: Đối tượng Miễn/Giảm thuế */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4 p-md-5 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '48px', height: '48px', fontSize: '20px', backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Đối tượng Miễn/Giảm thuế</h5>
                    <p className="text-muted small mb-0">Danh sách cá nhân được áp dụng chính sách giảm trừ</p>
                  </div>
                </div>

                {uploadMessage && (
                  <div className={`alert alert-${uploadMessage.type} small py-2 mb-3`}>
                    {uploadMessage.text}
                  </div>
                )}

                {/* Upload Box */}
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="d-none" 
                />
                <div 
                  className="border border-dashed rounded-3 p-4 text-center mb-4 flex-grow-1 d-flex flex-column justify-content-center" 
                  style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1', cursor: isUploading ? 'not-allowed' : 'pointer' }}
                  onClick={() => !isUploading && fileInputRef.current.click()}
                >
                  {isUploading ? (
                    <div className="spinner-border text-danger mx-auto mb-3"></div>
                  ) : (
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '48px', height: '48px', backgroundColor: '#fff', border: '1px solid #fecaca', color: '#dc2626', fontSize: '20px' }}>
                      <i className="bi bi-upload"></i>
                    </div>
                  )}
                  <div className="fw-bold text-dark mb-1">{isUploading ? 'Đang xử lý file...' : 'Tải lên file Excel Danh sách'}</div>
                  <div className="text-muted small">Kéo thả file vào đây hoặc click để chọn<br/>(Chỉ nhận .xlsx)</div>
                </div>

                <div className="d-flex justify-content-between align-items-center rounded-3 p-3" style={{ backgroundColor: '#faf5ff' }}>
                  <div>
                    <div className="small text-muted mb-1" style={{ fontSize: '12px' }}>Năm áp dụng: 2026</div>
                    <div className="fw-bold" style={{ color: '#8b5cf6', fontSize: '14px' }}>10 Bản ghi</div>
                  </div>
                  <button 
                    className="btn fw-bold d-flex align-items-center gap-2" 
                    style={{ backgroundColor: '#fff', border: '1px solid #ddd6fe', color: '#8b5cf6', fontSize: '13px' }}
                    onClick={() => setIsExemptModalOpen(true)}
                  >
                    Xem danh sách <i className="bi bi-chevron-right" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Hạn mức đất ở tối đa */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4 p-md-5 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '48px', height: '48px', fontSize: '20px', backgroundColor: '#fffbeb', color: '#d97706' }}>
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Hạn mức đất ở (m2)</h5>
                      <p className="text-muted small mb-0">Cấu hình định mức cho Phường/Xã</p>
                    </div>
                  </div>
                  <button className="btn btn-light border-0 btn-sm text-muted" onClick={fetchRegions} disabled={isLoadingRegions}>
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>

                <div className="d-flex flex-column gap-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {isLoadingRegions ? (
                     <div className="text-center py-4"><span className="spinner-border text-warning spinner-border-sm"></span></div>
                  ) : (
                    regions.map((region, idx) => (
  <div key={idx} className="border rounded-3 p-3 d-flex justify-content-between align-items-center bg-white shadow-sm">
    <div>
      {/* Map trường districtCode và wardCode */}
      <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>{region.districtCode} - {region.wardCode}</div>
      {/* Map trường streetName và positionLevel */}
      <div className="text-muted small mt-1">{region.streetName} (Vị trí: {region.positionLevel})</div>
    </div>
    <div className="d-flex align-items-center gap-3">
      {/* Map trường landQuota */}
      <div className="fw-bold text-dark fs-5">{region.landQuota} <span style={{fontSize: '14px', fontWeight: '600'}}>m²</span></div>
      <button 
        className="btn btn-light border d-flex align-items-center justify-content-center" 
        style={{ width: '36px', height: '36px' }}
        onClick={() => handleOpenConfig(region)}
      >
        <i className="bi bi-gear text-secondary"></i>
      </button>
    </div>
  </div>
))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- MODAL 1: DANH SÁCH ĐỐI TƯỢNG MIỄN GIẢM --- */}
{isExemptModalOpen && (
  <div className="modal-overlay d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}>
    <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '850px', borderRadius: '16px', overflow: 'hidden' }}>
      <div className="bg-danger text-white px-4 py-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-list-check fs-5"></i>
          <h5 className="mb-0 fw-bold">Danh sách Đối tượng Miễn/Giảm thuế</h5>
        </div>
        <button className="btn text-white fs-4 p-0" onClick={() => setIsExemptModalOpen(false)}>
          <i className="bi bi-x"></i>
        </button>
      </div>

      <div className="p-4">
        {/* Filter Bar - ONLY ONCE */}
        <div className="row g-3 mb-4">
          <div className="col-md-7 position-relative">
            <i className="bi bi-search position-absolute text-muted" style={{ left: '25px', top: '50%', transform: 'translateY(-50%)' }}></i>
            <input 
              type="text" 
              className="form-control py-2" 
              placeholder="Tìm kiếm theo Tên hoặc ID Công dân..." 
              value={exemptSearch}
              onChange={(e) => setExemptSearch(e.target.value)}
              style={{ paddingLeft: '40px', borderRadius: '8px' }}
            />
          </div>
          <div className="col-md-5">
            <select 
              className="form-select py-2" 
              value={exemptType}
              onChange={(e) => setExemptType(e.target.value)}
              style={{ borderRadius: '8px' }}
            >
              <option>Tất cả lý do miễn giảm</option>
              <option>Thương binh</option>
              <option>Hộ nghèo</option>
              <option>Mẹ VNAH</option>
              <option>Gia đình chính sách</option>
            </select>
          </div>
        </div>

        {/* Table - ONLY ONCE */}
        <div className="table-responsive mb-3 border rounded-3">
          <table className="table table-borderless table-hover align-middle mb-0">
            <thead className="border-bottom bg-light">
              <tr>
                <th className="py-3 px-4 text-muted small fw-bold">ID CÔNG DÂN</th>
                <th className="py-3 px-4 text-muted small fw-bold">HỌ VÀ TÊN</th>
                <th className="py-3 px-4 text-muted small fw-bold">LÝ DO MIỄN GIẢM</th>
                <th className="py-3 px-4 text-muted small fw-bold">MỨC MIỄN GIẢM (%)</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EXEMPTIONS
                .filter(item => {
                  const searchLower = exemptSearch.toLowerCase();
                  const matchesSearch = 
                    item.citizen_id.toString().includes(searchLower) || 
                    item.full_name.toLowerCase().includes(searchLower);
                  const matchesType = 
                    exemptType === 'Tất cả lý do miễn giảm' || 
                    item.exemption_reason === exemptType;
                  return matchesSearch && matchesType;
                })
                .map((item, idx) => (
                  <tr key={idx} className="border-bottom">
                    <td className="py-3 px-4 text-secondary font-monospace">{item.citizen_id}</td>
                    <td className="py-3 px-4 fw-bold text-dark">{item.full_name}</td>
                    <td className="py-3 px-4 text-muted">{item.exemption_reason}</td>
                    <td className="py-3 px-4">
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                        {item.discount_rate}%
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {/* Empty State */}
          {MOCK_EXEMPTIONS.filter(item => {
            const searchLower = exemptSearch.toLowerCase();
            const matchesSearch = 
              item.citizen_id.toString().includes(searchLower) || 
              item.full_name.toLowerCase().includes(searchLower);
            const matchesType = 
              exemptType === 'Tất cả lý do miễn giảm' || 
              item.exemption_reason === exemptType;
            return matchesSearch && matchesType;
          }).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '32px' }}></i>
              <p className="text-muted mt-3">Không tìm thấy bản ghi nào phù hợp</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

        {/* --- MODAL 2: CẤU HÌNH HẠN MỨC --- */}
        {isConfigModalOpen && selectedRegion && (
          <div className="modal-overlay d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}>
            <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden' }}>
              <div className="bg-danger text-white px-4 py-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt fs-5"></i>
                  <h5 className="mb-0 fw-bold">Cấu hình Hạn mức Đất ở</h5>
                </div>
                <button className="btn text-white fs-4 p-0" onClick={() => setIsConfigModalOpen(false)}>
                  <i className="bi bi-x"></i>
                </button>
              </div>

              <div className="p-4">
                <div className="alert alert-warning d-flex gap-3 align-items-start border-warning" style={{ borderRadius: '12px' }}>
                  <i className="bi bi-exclamation-triangle-fill mt-1"></i>
                  <div className="small" style={{ lineHeight: '1.5' }}>
                    Hạn mức đất ở ảnh hưởng trực tiếp đến hệ số đóng thuế lũy tiến của bất động sản nằm trên địa bàn này.
                  </div>
                </div>

                <div className="row g-3 mt-3">
                  <div className="col-6">
                    <label className="form-label fw-bold small text-secondary">Mã Quận/Huyện</label>
                    <input type="text" className="form-control bg-light" value={selectedRegion.district_code} readOnly style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold small text-secondary">Mã Phường/Xã</label>
                    <input type="text" className="form-control bg-light" value={selectedRegion.ward_code} readOnly style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Tên Đường / Khu vực</label>
                    <input type="text" className="form-control bg-light" value={selectedRegion.street_name} readOnly style={{ borderRadius: '8px' }} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Hạn mức tối đa (m2)</label>
                    <div className="position-relative">
                      {/* Map trường land_quota */}
                      <input type="text" className="form-control fw-bold text-dark" defaultValue={selectedRegion.land_quota} style={{ borderRadius: '8px', paddingRight: '40px' }} />
                      <span className="position-absolute text-muted fw-semibold" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }}>m²</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button className="btn btn-light border fw-semibold px-4" style={{ borderRadius: '8px' }} onClick={() => setIsConfigModalOpen(false)}>Hủy bỏ</button>
                  <button className="btn btn-danger fw-semibold px-4" style={{ borderRadius: '8px' }} onClick={() => setIsConfigModalOpen(false)}>Lưu cấu hình</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;