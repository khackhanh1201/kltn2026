import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';

const SearchPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');

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
      // Gọi API tra cứu (nếu backend chưa có thì sẽ vào catch)
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
      setResults(data);

    } catch (err) {
      console.error(err);
      // Tạm thời hiển thị dữ liệu mẫu khi backend chưa có endpoint
      setResults([
        {
          id: "TD-HN-00124",
          title: "Hồ sơ đăng ký biến động",
          type: "declaration",
          description: "Thửa 102, Tờ 15, P. Bến Nghé, Q.1"
        },
        {
          id: "TAX-2026-001",
          title: "Thuế sử dụng đất phi nông nghiệp",
          type: "tax",
          description: "85.5 m² - Thuế suất 0.03%"
        },
        {
          id: "COM-2026-005",
          title: "Khiếu nại về số tiền thuế",
          type: "complaint",
          description: "Khiếu nại về khoản thuế tháng 3/2026"
        }
      ]);
      setError("Backend chưa có endpoint /api/search. Đang hiển thị dữ liệu mẫu.");
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
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Nhập mã hồ sơ, mã thửa đất, mã số thuế, CCCD..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className="btn btn-danger px-5" 
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
              className={`btn ${activeTab === tab.key ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Kết quả */}
        {hasSearched && (
          <div className="card shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger" />
                  <p className="mt-3">Đang tra cứu...</p>
                </div>
              ) : error ? (
                <div className="alert alert-warning">{error}</div>
              ) : results.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-search fs-1 mb-3" />
                  <p>Không tìm thấy kết quả nào phù hợp với từ khóa "{keyword}"</p>
                </div>
              ) : (
                <div className="list-group">
                  {results.map((item, index) => (
                    <div 
                      key={index} 
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                    >
                      <div>
                        <div className="fw-bold">
  Thửa {item.parcelNumber}
</div>

<small className="text-muted">
  {item.address} • {item.areaSize} m²
</small>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => alert(`Đang xem chi tiết: ${item.title || item.id}`)}
                      >
                        Xem chi tiết →
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
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-clock-history"></i> Tra cứu gần đây
            </h6>
            <div className="card shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="list-group list-group-flush">
                <div className="list-group-item py-3">
                  TD-HN-00124 — Hồ sơ đăng ký biến động
                </div>
                <div className="list-group-item py-3">
                  TAX-2026-001 — Thuế sử dụng đất phi nông nghiệp
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-5 text-muted small">
          Cơ quan Thuế / Cơ quan Địa chính Việt Nam<br />
          Hotline: 1900 xxxx • Hướng dẫn sử dụng hệ thống
        </div>
      </div>
    </LandTaxLayout>
  );
};

export default SearchPage;