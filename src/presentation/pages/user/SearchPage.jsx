import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';

const SearchPage = () => {
  const navigate = useNavigate();
  const { user } = useUserInfo();

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'land', label: 'Đất đai' },
    { key: 'tax', label: 'Thuế' },
    { key: 'declaration', label: 'Hồ sơ' },
    { key: 'payment', label: 'Thanh toán' },
    { key: 'complaint', label: 'Khiếu nại' },
  ];

  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      // Gọi API tra cứu
      const res = await fetch(
        `http://localhost:8080/api/land-parcels/search?mapSheet=${encodeURIComponent(keyword)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Không thể thực hiện tra cứu. Backend chưa hỗ trợ endpoint này.');
      }

      const json = await res.json();
      const data = json.data || json || [];
      
      // Map dữ liệu chuẩn từ Backend (Bảng land_parcels)
      const mappedData = data.map(item => ({
        id: item.land_parcel_id || item.landParcelId || item.id,
        parcelNumber: item.parcel_number || item.parcelNumber || '—',
        mapSheetNumber: item.map_sheet_number || item.mapSheetNumber || '—',
        areaSize: item.area_size || item.areaSize || 0,
        address: item.address || 'Không có địa chỉ',
        certificateNumber: item.certificate_number || item.certificateNumber || item.gcn_book_number || item.gcnBookNumber || '—',
        type: 'land' // Đánh dấu loại kết quả
      }));
      
      setResults(mappedData);

    } catch (err) {
      console.error(err);
      // Hiển thị dữ liệu mẫu map chuẩn theo DB nếu backend lỗi hoặc chưa code API
      setResults([
        {
          id: 1,
          parcelNumber: "P001",
          mapSheetNumber: "M001",
          areaSize: 100.5,
          address: "Số 1 Nguyễn Trãi, Thanh Xuân, Hà Nội",
          certificateNumber: "GCN-2026-00123",
          type: 'land'
        },
        {
          id: 2,
          parcelNumber: "P005",
          mapSheetNumber: "M002",
          areaSize: 85.0,
          address: "Số 5 Điện Biên Phủ, Ba Đình, Hà Nội",
          certificateNumber: "GCN-2026-00456",
          type: 'land'
        }
      ]);
      setError("Cảnh báo: Không thể kết nối API. Đang hiển thị dữ liệu mẫu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LandTaxLayout user={user}>
      <div className="container py-4" style={{ maxWidth: '900px' }}>
        <div className="mb-4">
          <h3 className="fw-bold">Tra cứu tổng hợp</h3>
          <p className="text-muted">Tìm kiếm thông tin toàn hệ thống: đất đai, thuế, hồ sơ, thanh toán, khiếu nại...</p>
        </div>

        {/* Ô tìm kiếm */}
        <div className="input-group mb-4 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <span className="input-group-text bg-white border-end-0 px-4 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control form-control-lg border-start-0 py-3"
            placeholder="Nhập mã thửa đất, tờ bản đồ, số GCN, địa chỉ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{ fontSize: '15px', boxShadow: 'none' }}
          />
          <button 
            className="btn btn-danger px-5 fw-bold" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4 d-flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`btn fw-semibold rounded-pill px-4 py-2 ${activeTab === tab.key ? 'btn-danger' : 'btn-light border text-secondary'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Kết quả */}
        {hasSearched && (
          <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger" />
                  <p className="mt-3 text-muted">Đang tra cứu dữ liệu...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-search fs-1 mb-3 opacity-50" />
                  <p>Không tìm thấy kết quả nào phù hợp với từ khóa "{keyword}"</p>
                </div>
              ) : (
                <div className="list-group list-group-flush gap-2">
                  {error && <div className="alert alert-warning py-2 small mb-3">{error}</div>}
                  
                  {results.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className="list-group-item list-group-item-action d-flex flex-column flex-md-row justify-content-between align-items-md-center py-3 px-4 border rounded-3 mb-2"
                    >
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill">Thửa đất</span>
                          <span className="fw-bold text-dark fs-5">Thửa số: {item.parcelNumber}</span>
                        </div>
                        <div className="text-secondary small fw-medium mt-2">
                          <span className="me-3"><i className="bi bi-file-earmark-text"></i> Tờ bản đồ: {item.mapSheetNumber}</span>
                          <span className="me-3"><i className="bi bi-bounding-box"></i> Diện tích: {item.areaSize} m²</span>
                          <span><i className="bi bi-award"></i> Sổ GCN: {item.certificateNumber}</span>
                        </div>
                        <div className="text-muted small mt-1">
                          <i className="bi bi-geo-alt"></i> Địa chỉ: {item.address}
                        </div>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger fw-semibold mt-3 mt-md-0 px-3 py-2 rounded-pill whitespace-nowrap"
                        onClick={() => navigate('/land-information')}
                      >
                        Xem chi tiết <i className="bi bi-arrow-right ms-1"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tra cứu gần đây (khi chưa search) */}
        {!hasSearched && (
          <div>
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <i className="bi bi-clock-history text-danger"></i> Lịch sử tra cứu gần đây
            </h6>
            <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
              <div className="list-group list-group-flush">
                <div className="list-group-item py-3 px-4 text-secondary cursor-pointer" onClick={() => {setKeyword('P001'); handleSearch();}}>
                  <i className="bi bi-search me-2 opacity-50"></i> Tra cứu Thửa P001 - M001
                </div>
                <div className="list-group-item py-3 px-4 text-secondary cursor-pointer" onClick={() => {setKeyword('Điện Biên Phủ'); handleSearch();}}>
                  <i className="bi bi-search me-2 opacity-50"></i> Tra cứu theo địa chỉ: Điện Biên Phủ
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-5 text-muted small">
          Hệ thống Quản lý Thuế & Đất đai<br />
          Tích hợp cơ sở dữ liệu quốc gia
        </div>
      </div>
    </LandTaxLayout>
  );
};

export default SearchPage;