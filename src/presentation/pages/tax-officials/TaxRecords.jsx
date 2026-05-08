import React, { useState, useEffect } from 'react';
import LandTaxLayout from '../../components/LandTaxLayout';

const API_BASE = 'http://localhost:9090/api';

// --- Helper Components & Styles ---
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', zIndex: 5000, backdropFilter: 'blur(4px)'
};

const modalContentStyle = {
  background: '#fff', borderRadius: 24, width: '90%', 
  overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

const modalHeaderStyle = {
  padding: '20px 30px', borderBottom: '1px solid #f1f5f9', 
  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

const modalFooterStyle = {
  padding: '20px 30px', borderTop: '1px solid #f1f5f9', 
  display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#fff'
};

const closeButtonStyle = { 
  background: '#f1f5f9', border: 'none', borderRadius: '50%', 
  width: 36, height: 36, cursor: 'pointer', display: 'flex', 
  alignItems: 'center', justifyContent: 'center' 
};

const btnPrimary = { padding: '12px 24px', borderRadius: 10, border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };
const btnSecondary = { padding: '12px 24px', borderRadius: 10, border: 'none', background: '#e2e8f0', color: '#475569', fontWeight: 600, cursor: 'pointer' };

const SectionTitle = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '24px 0 12px', color: '#64748b' }}>
    <i className={`bi bi-${icon}`}></i>
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{title}</span>
  </div>
);

const InfoRow = ({ label, value, bold, half }) => (
  <div style={{ marginBottom: 16, width: half ? '48%' : '100%' }}>
    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontWeight: bold ? 700 : 500, fontSize: 15, color: '#1e293b' }}>{value || '—'}</div>
  </div>
);

const FormatCard = ({ active, label, onClick }) => (
  <div onClick={onClick} style={{
    flex: 1, padding: '24px', borderRadius: 20, border: active ? '2px solid #a30d11' : '1px solid #e2e8f0',
    textAlign: 'center', cursor: 'pointer', background: active ? '#fff1f2' : '#fff', transition: 'all 0.2s'
  }}>
    <h3 style={{ margin: 0, color: active ? '#a30d11' : '#1e293b', fontWeight: 800 }}>{label}</h3>
    <small style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: 1 }}>TÀI LIỆU</small>
  </div>
);

// --- Main Component ---
const TaxRecords = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');

  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Modal States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportFormat, setExportFormat] = useState('PDF');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tax/records`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Không thể tải dữ liệu');
      const json = await res.json();
      const data = Array.isArray(json) ? json : (json?.data || []);
      setRecords(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = search.toLowerCase();
    const result = records.filter(r =>
      (r.taxId || '').toLowerCase().includes(q) ||
      (r.fullName || '').toLowerCase().includes(q) ||
      (r.cccd || '').toLowerCase().includes(q)
    );
    setFiltered(result);
  }, [search, records]);

  // Handlers
  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

  const handleOpenExport = (record) => {
    setSelectedRecord(record);
    setShowExportOptions(true);
  };

  return (
    <LandTaxLayout user={user}>
      <div style={{ padding: '20px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontWeight: 800, margin: 0 }}>Quản lý hồ sơ thuế</h3>
            <p style={{ color: '#64748b', margin: '4px 0 0' }}>Tra cứu và quản lý nghĩa vụ tài chính của người dân</p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative', width: 360 }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Tìm kiếm mã hồ sơ, tên người nộp..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px 12px 48px',
                  border: '1px solid #e2e8f0', borderRadius: 50,
                  fontSize: 14, outline: 'none', background: '#fff'
                }}
              />
            </div>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                padding: '12px 24px', background: '#a30d11', color: '#fff',
                border: 'none', borderRadius: 8, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
              }}
            >
              <i className="bi bi-filter" /> Tìm kiếm nâng cao
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b' }}>STT</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b' }}>MÃ HỒ SƠ</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b' }}>HỌ VÀ TÊN</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b' }}>CCCD</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b' }}>ĐỊA CHỈ</th>
                <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: 12, color: '#64748b' }}>SỐ THUẾ (VNĐ)</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 12, color: '#64748b' }}>CHI TIẾT</th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 12, color: '#64748b' }}>XUẤT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '80px' }}><div className="spinner-border text-danger" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Không có hồ sơ nào</td></tr>
              ) : (
                filtered.map((r, index) => (
                  <tr key={r.taxId || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '18px 20px' }}>{index + 1}</td>
                    <td style={{ padding: '18px 20px', fontWeight: 600, color: '#a30d11' }}>{r.taxId || `T-2026-00${index + 1}`}</td>
                    <td style={{ padding: '18px 20px', fontWeight: 500 }}>{r.fullName || '—'}</td>
                    <td style={{ padding: '18px 20px' }}>{r.cccd || '—'}</td>
                    <td style={{ padding: '18px 20px', color: '#64748b', fontSize: 13 }}>{r.address || '—'}</td>
                    <td style={{ padding: '18px 20px', textAlign: 'right', fontWeight: 700 }}>
                      {r.taxAmount ? Number(r.taxAmount).toLocaleString('vi-VN') + 'đ' : '—'}
                    </td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <button onClick={() => handleViewDetail(r)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer' }}>
                        <i className="bi bi-eye" />
                      </button>
                    </td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <button onClick={() => handleOpenExport(r)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer' }}>
                        <i className="bi bi-download" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Modals Section --- */}

        {/* 1. Modal Chi tiết (Ảnh 3) */}
        {showDetail && selectedRecord && (
          <div style={modalOverlayStyle}>
            <div style={{ ...modalContentStyle, maxWidth: 800 }}>
              <div style={modalHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <div style={{ background: '#fff1f2', padding: '10px 12px', borderRadius: 12 }}>
                    <i className="bi bi-file-earmark-text text-danger" style={{ fontSize: 20 }}></i>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 800 }}>CHI TIẾT HỒ SƠ</h5>
                    <small style={{ color: '#64748b' }}>Mã hồ sơ: <span style={{ color: '#a30d11', fontWeight: 600 }}>{selectedRecord.taxId}</span></small>
                  </div>
                </div>
                <button onClick={() => setShowDetail(false)} style={closeButtonStyle}><i className="bi bi-x-lg"></i></button>
              </div>
              
              <div style={{ padding: '24px 40px', maxHeight: '70vh', overflowY: 'auto' }}>
                <SectionTitle icon="person" title="Thông tin người nộp thuế" />
                <InfoRow label="Họ và tên" value={selectedRecord.fullName} bold />
                <InfoRow label="Số CCCD/CMND" value={selectedRecord.cccd} />
                <InfoRow label="Địa chỉ thường trú" value={selectedRecord.address} />

                <SectionTitle icon="map" title="Thông tin thửa đất" />
                <div style={{ display: 'flex', gap: '4%' }}>
                  <InfoRow label="Thửa đất số" value={selectedRecord.landLot || '101'} half />
                  <InfoRow label="Tờ bản đồ số" value={selectedRecord.mapSheet || '10'} half />
                </div>
                <div style={{ display: 'flex', gap: '4%' }}>
                  <InfoRow label="Diện tích" value={`${selectedRecord.area || '120'}m2`} half />
                  <InfoRow label="Loại đất" value={selectedRecord.landType || 'Đất ở đô thị'} half />
                </div>
                <InfoRow label="Địa chỉ thửa đất" value={selectedRecord.address} />

                <SectionTitle icon="cash-stack" title="Nghĩa vụ tài chính" />
                <InfoRow label="Loại thuế/lệ phí" value="Thuế sử dụng đất PNN" />
                <div style={{ marginTop: 20 }}>
                  <small style={{ color: '#64748b', fontWeight: 700 }}>TỔNG SỐ TIỀN PHẢI NỘP</small>
                  <h2 style={{ color: '#a30d11', fontWeight: 900, marginTop: 4 }}>{Number(selectedRecord.taxAmount).toLocaleString('vi-VN')}đ</h2>
                </div>
              </div>

              <div style={modalFooterStyle}>
                <button style={{ ...btnPrimary, background: '#a30d11' }}><i className="bi bi-pencil-square"></i> CẬP NHẬT</button>
                <button onClick={() => setShowDetail(false)} style={btnSecondary}>ĐÓNG</button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Modal Lựa chọn Xuất (Ảnh 2) */}
        {showExportOptions && selectedRecord && (
          <div style={modalOverlayStyle}>
            <div style={{ ...modalContentStyle, maxWidth: 480, borderRadius: 40 }}>
              <div style={{ padding: '40px 40px 30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h2 style={{ fontWeight: 900, margin: 0, fontSize: 28, letterSpacing: -0.5 }}>XUẤT DỮ LIỆU HỒ SƠ</h2>
                  <button onClick={() => setShowExportOptions(false)} style={closeButtonStyle}><i className="bi bi-x-lg"></i></button>
                </div>
                <p style={{ color: '#64748b', marginBottom: 30 }}>Chọn định dạng và kiểm tra thông tin trước khi xuất</p>

                <div style={{ background: '#f8fafc', padding: '20px 24px', borderRadius: 24, marginBottom: 30 }}>
                  <SectionTitle icon="info-circle" title="Thông tin hồ sơ" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700 }}>MÃ HỒ SƠ</span>
                    <span style={{ color: '#a30d11', background: '#fff1f2', padding: '4px 12px', borderRadius: 12, fontWeight: 700, fontSize: 14 }}>{selectedRecord.taxId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700 }}>NGƯỜI NỘP</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{selectedRecord.fullName}</span>
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                   <small style={{ color: '#94a3b8', fontWeight: 800, fontSize: 11, letterSpacing: 1 }}>ĐỊNH DẠNG XUẤT</small>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
                  <FormatCard active={exportFormat === 'PDF'} label="PDF" onClick={() => setExportFormat('PDF')} />
                  <FormatCard active={exportFormat === 'DOC'} label="DOC" onClick={() => setExportFormat('DOC')} />
                </div>

                <button onClick={() => setShowPreview(true)} style={{ ...btnLarge, background: '#f1f5f9', color: '#1e293b', marginBottom: 12 }}>
                  <i className="bi bi-eye"></i> XEM TRƯỚC DỮ LIỆU
                </button>
                <button style={{ ...btnLarge, background: '#a30d11', color: '#fff' }}>
                  <i className="bi bi-download"></i> XUẤT DỮ LIỆU NGAY
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Modal Xem trước (Ảnh 1) */}
        {showPreview && selectedRecord && (
          <div style={{ ...modalOverlayStyle, zIndex: 6000 }}>
            <div style={{ ...modalContentStyle, maxWidth: 900, background: '#f1f5f9', height: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ ...modalHeaderStyle, background: '#fff' }}>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 800 }}>Xem trước dữ liệu xuất</h5>
                  <small style={{ color: '#64748b' }}>Định dạng: {exportFormat} | Hồ sơ: {selectedRecord.taxId}</small>
                </div>
                <button onClick={() => setShowPreview(false)} style={closeButtonStyle}><i className="bi bi-x-lg"></i></button>
              </div>
              
              <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
                {/* Giả lập tờ giấy A4 */}
                <div style={{ background: '#fff', width: '100%', maxWidth: 700, padding: '60px 50px', borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 50 }}>
                    <div>
                      <h5 style={{ fontWeight: 800, margin: 0 }}>THÔNG BÁO NGHĨA VỤ TÀI CHÍNH</h5>
                      <small style={{ color: '#64748b' }}>Mã hồ sơ: {selectedRecord.taxId}</small>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, margin: 0, fontSize: 12, textTransform: 'uppercase' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                      <p style={{ fontSize: 11, margin: 0 }}>Độc lập - Tự do - Hạnh phúc</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: 20, marginBottom: 20 }}>
                     <div style={{ flex: 1 }}>
                        <SectionTitle icon="person-fill" title="Thông tin người nộp" />
                        <InfoRow label="Họ và tên" value={selectedRecord.fullName} bold />
                        <InfoRow label="Số CCCD" value={selectedRecord.cccd} />
                     </div>
                     <div style={{ flex: 1 }}>
                        <SectionTitle icon="geo-alt-fill" title="Thông tin thửa đất" />
                        <InfoRow label="Thửa đất số" value={selectedRecord.landLot || '101'} />
                        <InfoRow label="Diện tích" value={`${selectedRecord.area || '120'} m2`} />
                     </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 30, borderRadius: 16, textAlign: 'center' }}>
                     <p style={{ color: '#64748b', fontSize: 13, marginBottom: 8, fontWeight: 600 }}>TỔNG SỐ TIỀN NIÊM YẾT</p>
                     <h1 style={{ color: '#a30d11', fontWeight: 900, margin: 0 }}>{Number(selectedRecord.taxAmount).toLocaleString('vi-VN')}đ</h1>
                  </div>

                  <div style={{ marginTop: 60, textAlign: 'right', paddingRight: 40 }}>
                     <p style={{ fontWeight: 700, fontSize: 12, marginBottom: 60 }}>CƠ QUAN THUẾ</p>
                     <p style={{ color: '#94a3b8', fontSize: 11 }}>(Ký và ghi rõ họ tên)</p>
                  </div>
                  
                  <div style={{ position: 'absolute', bottom: 20, left: 50 }}>
                     <small style={{ color: '#cbd5e1', fontSize: 10 }}>* Đây là bản xem trước dữ liệu xuất định dạng {exportFormat}</small>
                  </div>
                </div>
              </div>

              <div style={modalFooterStyle}>
                <button onClick={() => setShowPreview(false)} style={btnSecondary}>ĐÓNG BẢN XEM TRƯỚC</button>
                <button style={{ ...btnPrimary, background: '#a30d11', padding: '12px 30px' }}>XUẤT DỮ LIỆU NGAY</button>
              </div>
            </div>
          </div>
        )}

        {/* Panel Tìm kiếm nâng cao (Giữ nguyên từ code cũ) */}
        {showAdvanced && (
          <div style={{ position: 'fixed', top: 120, right: 40, width: 380, background: '#fff', borderRadius: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', zIndex: 4000, padding: 24 }}>
            <h5 style={{ marginBottom: 20, fontWeight: 700 }}>BỘ LỌC TÌM KIẾM NÂNG CAO</h5>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>Số vào sổ GCN</label>
              <input type="text" placeholder="Nhập số GCN..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>Họ và tên</label>
              <input type="text" placeholder="Nhập tên người nộp..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', background: '#f1f5f9', borderRadius: 8, fontWeight: 600 }}>Xóa bộ lọc</button>
              <button onClick={() => setShowAdvanced(false)} style={{ flex: 1, padding: '12px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </LandTaxLayout>
  );
};

const btnLarge = { 
  width: '100%', padding: '16px', border: 'none', 
  borderRadius: 50, fontWeight: 700, fontSize: 15, 
  cursor: 'pointer', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', gap: 10, transition: 'transform 0.1s' 
};

export default TaxRecords;