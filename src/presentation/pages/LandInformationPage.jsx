import React, { useState, useEffect } from 'react';
import LandTaxLayout from '../components/LandTaxLayout';

const API_BASE = 'http://localhost:9090/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const LAND_TYPE_LABELS = {
  ODT: 'Đất ở tại đô thị',
  CLN: 'Đất canh tác lâu năm',
  NTS: 'Đất nuôi trồng thủy sản',
  HNK: 'Đất hàng năm khác',
  TMD: 'Đất thương mại',
  SKC: 'Đất sản xuất kinh doanh',
  DGD: 'Đất giáo dục',
  DSN: 'Đất sản xuất',
};

const InfoField = ({ label, value }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500 }}>{value || '—'}</div>
  </div>
);

const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
};

const LandInformationPage = () => {
  const userRaw = JSON.parse(localStorage.getItem('user_info') || '{}');
  const token = localStorage.getItem('token') || userRaw?.token || userRaw?.data?.token || '';
  const jwtPayload = decodeJwt(token);

  const cccdNumber = jwtPayload?.cccdNumber || jwtPayload?.sub || userRaw?.cccdNumber || userRaw?.data?.cccdNumber || '';
  const user = userRaw?.data || userRaw;

  const [parcels, setParcels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  // Advanced Search
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advFilters, setAdvFilters] = useState({
    certificateNumber: '',
    parcelCode: '',
    mapSheetNumber: '',
    landType: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (cccdNumber) {
      fetchParcels();
    } else {
      setError('Không xác định được CCCD. Vui lòng đăng xuất và đăng nhập lại.');
      setLoading(false);
    }
  }, [cccdNumber]);

  const fetchParcels = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API_BASE}/land-parcels?ownerCccd=${encodeURIComponent(cccdNumber)}`,
        { headers: getAuthHeaders() }
      );
      if (!res.ok) throw new Error('Không thể tải dữ liệu');
      const json = await res.json();
      const data = Array.isArray(json) ? json : (json.data || []);
      setParcels(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message || 'Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  // Apply all filters
  useEffect(() => {
    let result = [...parcels];
    const q = search.toLowerCase();

    if (search) {
      result = result.filter(p =>
        (p.parcelCode || '').toLowerCase().includes(q) ||
        (p.address || '').toLowerCase().includes(q)
      );
    }

    if (advFilters.certificateNumber) {
      result = result.filter(p => (p.certificateNumber || '').toLowerCase().includes(advFilters.certificateNumber.toLowerCase()));
    }
    if (advFilters.parcelCode) {
      result = result.filter(p => (p.parcelCode || '').toLowerCase().includes(advFilters.parcelCode.toLowerCase()));
    }
    if (advFilters.mapSheetNumber) {
      result = result.filter(p => (p.mapSheetNumber || '').toLowerCase().includes(advFilters.mapSheetNumber.toLowerCase()));
    }
    if (advFilters.landType) {
      result = result.filter(p => p.landType === advFilters.landType);
    }
    if (advFilters.address) {
      result = result.filter(p => (p.address || '').toLowerCase().includes(advFilters.address.toLowerCase()));
    }

    setFiltered(result);
  }, [search, advFilters, parcels]);

  const getLandTypeLabel = (code) => LAND_TYPE_LABELS[code] || code || '—';

  const resetFilters = () => {
    setAdvFilters({
      certificateNumber: '',
      parcelCode: '',
      mapSheetNumber: '',
      landType: '',
      address: '',
    });
    setSearch('');
    setShowAdvanced(false);
  };

  return (
    <LandTaxLayout user={user}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: 28 }}>Danh sách đất đai</h4>
          <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Quản lý thông tin các thửa đất của bạn</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative', width: 340 }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm kiếm mã thửa, địa chỉ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 46px 12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: 50,
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={() => setShowAdvanced(true)}
            style={{
              padding: '12px 24px',
              background: '#b91c1c',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <i className="bi bi-sliders2" /> Tìm kiếm nâng cao
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Bảng danh sách */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>SỐ VÀO SỔ CẤP GCN</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>THỬA ĐẤT SỐ</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>TỜ BẢN ĐỒ SỐ</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>LOẠI ĐẤT</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>ĐỊA CHỈ</th>
              <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '80px' }}><div className="spinner-border text-danger" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Không tìm thấy thửa đất nào</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.parcelId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '18px 20px', fontWeight: 600 }}>{p.certificateNumber || '—'}</td>
                  <td style={{ padding: '18px 20px', fontWeight: 600 }}>{p.parcelCode || '—'}</td>
                  <td style={{ padding: '18px 20px' }}>{p.mapSheetNumber || '—'}</td>
                  <td style={{ padding: '18px 20px' }}>{getLandTypeLabel(p.landType)}</td>
                  <td style={{ padding: '18px 20px', color: '#475569' }}>{p.address || '—'}</td>
                  <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                    <button
                      onClick={() => setSelected(p)}
                      style={{ background: 'none', border: 'none', fontSize: 22, color: '#64748b', cursor: 'pointer' }}
                    >
                      <i className="bi bi-eye" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ==================== MODAL GIẤY CHỨNG NHẬN ==================== */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', width: 1000, maxWidth: '96vw', borderRadius: 12, maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            {/* Header */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', textAlign: 'center' }}>
              <h5 style={{ margin: 0, color: '#b91c1c', fontWeight: 700 }}>GIẤY CHỨNG NHẬN</h5>
              <p style={{ margin: 4, color: '#b91c1c', fontWeight: 600 }}>
                QUYỀN SỬ DỤNG ĐẤT, QUYỀN SỞ HỮU NHÀ Ở VÀ TÀI SẢN KHÁC GẮN LIỀN VỚI ĐẤT
              </p>
            </div>

            <div style={{ padding: '28px', overflowY: 'auto', maxHeight: 'calc(92vh - 180px)' }}>
              {/* Người sử dụng đất */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>NGƯỜI SỬ DỤNG ĐẤT, CHỦ SỞ HỮU NHÀ Ở VÀ TÀI SẢN KHÁC GẮN LIỀN VỚI ĐẤT</div>
                <div style={{ display: 'flex', gap: 60 }}>
                  <div><strong>Chủ đất:</strong> {user.fullName || '—'}</div>
                  <div><strong>CCCD:</strong> {cccdNumber || '—'}</div>
                </div>
              </div>

              {/* Thông tin thửa đất */}
              <div style={{ marginBottom: 24 }}>
                <h6 style={{ color: '#b91c1c', fontWeight: 700, marginBottom: 16 }}>THÔNG TIN THỬA ĐẤT</h6>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
                  <InfoField label="Thửa đất số:" value={selected.parcelCode} />
                  <InfoField label="Tờ bản đồ số:" value={selected.mapSheetNumber} />
                  <InfoField label="Diện tích:" value={selected.area ? `${selected.area} m²` : '—'} />
                  <InfoField label="Loại đất:" value={getLandTypeLabel(selected.landType)} />
                  <InfoField label="Thời hạn sử dụng:" value="Lâu dài" />
                  <InfoField label="Hình thức sử dụng:" value="Sử dụng riêng" />
                  <InfoField label="Địa chỉ:" value={selected.address} span={2} />
                  <InfoField label="Nguồn gốc sử dụng:" value="Nhận chuyển nhượng đất được Nhà nước giao đất có thu tiền sử dụng đất" span={2} />
                  <InfoField label="Số vào sổ cấp GCN:" value={selected.certificateNumber} />
                </div>

                <div style={{ marginTop: 16 }}>
                  <strong>File PDF thông tin đất đai:</strong>{' '}
                  <button style={{ color: '#b91c1c', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                    Xem file PDF
                  </button>
                </div>
              </div>

              {/* Tài sản gắn liền */}
              <div style={{ marginBottom: 24 }}>
                <h6 style={{ color: '#b91c1c', fontWeight: 700, marginBottom: 12 }}>TÀI SẢN GẮN LIỀN VỚI ĐẤT</h6>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                  <InfoField label="Nhà ở:" value="—" />
                  <InfoField label="Công trình khác:" value="—" />
                </div>
              </div>

              {/* Ghi chú */}
              <div style={{ marginBottom: 24 }}>
                <h6 style={{ color: '#b91c1c', fontWeight: 700, marginBottom: 12 }}>GHI CHÚ</h6>
                <p style={{ color: '#64748b' }}>—</p>
              </div>

              {/* Sơ đồ thửa đất */}
              <div style={{ marginBottom: 32 }}>
                <h6 style={{ color: '#b91c1c', fontWeight: 700, marginBottom: 12 }}>SƠ ĐỒ THỬA ĐẤT, NHÀ Ở VÀ TÀI SẢN KHÁC</h6>
                <div style={{ border: '2px dashed #cbd5e1', borderRadius: 8, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '#f8fafc' }}>
                  <i className="bi bi-map" style={{ fontSize: 50, color: '#94a3b8' }}></i>
                  <p style={{ marginTop: 12, color: '#64748b' }}>Sơ đồ và bảng liệt kê tọa độ</p>
                </div>
                <button style={{ marginTop: 12, color: '#b91c1c', background: 'none', border: 'none', textDecoration: 'underline' }}>
                  Xem file PDF
                </button>
              </div>

              {/* Những thay đổi sau cấp GCN */}
              <div>
                <h6 style={{ color: '#b91c1c', fontWeight: 700, marginBottom: 12 }}>NHỮNG THAY ĐỔI SAU KHI CẤP GCN</h6>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: 14, textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Nội dung thay đổi và cơ sở pháp lý</th>
                      <th style={{ padding: 14, textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Xác nhận cơ quan thẩm quyền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 14, color: '#64748b' }}>Chưa có thông tin thay đổi</td>
                      <td style={{ padding: 14, color: '#64748b' }}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#f8fafc' }}>
              <button style={{ padding: '10px 24px', border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff' }}>Tải về PDF</button>
              <button style={{ padding: '10px 24px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8 }}>Khiếu nại</button>
              <button
                onClick={() => setSelected(null)}
                style={{ padding: '10px 32px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 8 }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PANEL TÌM KIẾM NÂNG CAO ==================== */}
      {showAdvanced && (
        <div style={{
          position: 'fixed',
          top: 110,
          right: 40,
          width: 380,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          zIndex: 4000,
          padding: 24,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <h5 style={{ marginBottom: 20, fontWeight: 700, color: '#0f172a' }}>Tìm kiếm nâng cao</h5>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>Số vào sổ cấp GCN</label>
            <input
              type="text"
              placeholder="Nhập số vào sổ..."
              value={advFilters.certificateNumber}
              onChange={(e) => setAdvFilters({ ...advFilters, certificateNumber: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>Thửa đất số</label>
            <input
              type="text"
              placeholder="Nhập số thửa..."
              value={advFilters.parcelCode}
              onChange={(e) => setAdvFilters({ ...advFilters, parcelCode: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>Tờ bản đồ số</label>
            <input
              type="text"
              placeholder="Nhập số tờ bản đồ..."
              value={advFilters.mapSheetNumber}
              onChange={(e) => setAdvFilters({ ...advFilters, mapSheetNumber: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>Loại đất</label>
            <select
              value={advFilters.landType}
              onChange={(e) => setAdvFilters({ ...advFilters, landType: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
            >
              <option value="">Tất cả</option>
              {Object.entries(LAND_TYPE_LABELS).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>Địa chỉ</label>
            <input
              type="text"
              placeholder="Nhập địa chỉ thửa đất..."
              value={advFilters.address}
              onChange={(e) => setAdvFilters({ ...advFilters, address: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={resetFilters}
              style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#475569', borderRadius: 8, fontWeight: 500 }}
            >
              Xóa bộ lọc
            </button>
            <button
              onClick={() => setShowAdvanced(false)}
              style={{ flex: 1, padding: '12px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </LandTaxLayout>
  );
};

export default LandInformationPage;