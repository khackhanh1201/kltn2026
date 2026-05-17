import React, { useState, useEffect } from 'react';
import TaxOfficerLayout from '../../components/TaxOfficerLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';
const API_BASE = 'http://localhost:8080/api';

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
  const { user } = useUserInfo();
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
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const fetchRecords = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/tax/records/verified`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!res.ok) throw new Error('Không thể tải dữ liệu');
    const json = await res.json();
    let data = Array.isArray(json) ? json : (json?.data || []);
    
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
      (r.recordId || '').toString().toLowerCase().includes(q) ||
      (r.senderCccd || '').toLowerCase().includes(q) ||
      (r.phoneNumber || '').toLowerCase().includes(q)
    );
    setFiltered(result);
  }, [search, records]);

  // Handlers
    // Fetch tax declaration details
  // Thay phần fetchDeclarationDetail này:
// Thay fetchDeclarationDetail này:
const fetchDeclarationDetail = async (record) => {
  setLoadingDetail(true);
  setDetailError('');
  try {
    console.log('=== FETCHING DETAIL FOR recordId:', record.recordId);
    
    // Không fetch thêm - chỉ dùng dữ liệu từ record
    // Backend chỉ cung cấp: recordId, citizenId, landParcelId, recordCategory, currentStatus, submittedAt
    let detailData = { 
      ...record,
      // Mock data cho các trường chưa có từ API
      fullName: record.fullName || 'Trần Văn A',
      senderCccd: record.senderCccd || '001090123456',
      address: record.address || '123 Đường Kim Giang, Phường Thanh Liêu, Huyện Thanh Trì, TP. Hà Nội',
      landParcelNumber: record.landParcelNumber || '101',
      mapSheetNumber: record.mapSheetNumber || '10',
      area: record.area || '120',
      landType: record.landType || 'Đất ở đô thị',
      landAddress: record.landAddress || '123 Đường Kim Giang, Phường Thanh Liêu, Huyện Thanh Trì, TP. Hà Nội',
      taxType: record.taxType || 'Thuế sử dụng đất PNN',
      calculatedTaxAmount: record.calculatedTaxAmount || 1200000,
      phoneNumber: record.phoneNumber || '0987654321'
    };
    
    console.log('=== FINAL DETAIL DATA ===', detailData);
    setSelectedRecord(detailData);
    
  } catch (err) {
    console.error('Error fetching detail:', err);
    setSelectedRecord(record);
  } finally {
    setLoadingDetail(false);
  }
};

  const handleViewDetail = (record) => {
    setShowDetail(true);
    fetchDeclarationDetail(record);
  };

  const handleOpenExport = (record) => {
    setSelectedRecord(record);
    setShowExportOptions(true);
  };

  // Format status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { bg: '#fef2f2', color: '#a30d11', text: 'Chờ duyệt' },
      'VERIFIED': { bg: '#f0fdf4', color: '#16a34a', text: 'Xác thực' },
      'APPROVED': { bg: '#f0fdf4', color: '#16a34a', text: 'Duyệt' },
      'REJECTED': { bg: '#fee2e2', color: '#a30d11', text: 'Từ chối' }
    };
    const map = statusMap[status] || statusMap['PENDING'];
    return map;
  };

  return (
    <TaxOfficerLayout user={user}>
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
                placeholder="Tìm kiếm CCCD, số hồ sơ..."
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
      <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700 }}>STT</th>
      <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700 }}>MÃ HỒ SƠ</th>
      <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700 }}>HỌ VÀ TÊN</th>
      <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700 }}>CCCD</th>
      <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700 }}>ĐỊA CHỈ</th>
      <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: 12, color: '#64748b', fontWeight: 700 }}>SỐ THUẾ (VNĐ)</th>
      <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 12, color: '#64748b', fontWeight: 700 }}>THAO TÁC</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr><td colSpan="7" style={{ textAlign: 'center', padding: '80px' }}><div className="spinner-border text-danger" /></td></tr>
    ) : filtered.length === 0 ? (
      <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Không có hồ sơ nào</td></tr>
    ) : (
      filtered.map((r, index) => (
        <tr key={r.recordId || index} style={{ borderBottom: '1px solid #f1f5f9', hover: { background: '#f8fafc' } }}>
          <td style={{ padding: '16px 20px', fontSize: 13, color: '#64748b' }}>{index + 1}</td>
          <td style={{ padding: '16px 20px', fontWeight: 600, color: '#a30d11', fontSize: 13 }}>T-{new Date().getFullYear()}-{String(r.recordId).padStart(3, '0')}</td>
          <td style={{ padding: '16px 20px', fontWeight: 500, color: '#1e293b', fontSize: 13 }}>{r.fullName || '—'}</td>
          <td style={{ padding: '16px 20px', fontWeight: 500, color: '#1e293b', fontSize: 13 }}>{r.senderCccd || '—'}</td>
          <td style={{ padding: '16px 20px', color: '#64748b', fontSize: 13 }}>{r.address || '—'}</td>
          <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: '#a30d11', fontSize: 13 }}>
            {r.calculatedTaxAmount ? Number(r.calculatedTaxAmount).toLocaleString('vi-VN') + 'đ' : '—'}
          </td>
          <td style={{ padding: '16px 20px', textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button 
              onClick={() => handleViewDetail(r)} 
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }} 
              title="Xem chi tiết"
            >
              <i className="bi bi-eye" />
            </button>
            <button 
              onClick={() => handleOpenExport(r)} 
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }} 
              title="Xuất dữ liệu"
            >
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

        {/* 1. Modal Chi tiết */}
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
            <small style={{ color: '#64748b' }}>Mã hồ sơ: <span style={{ color: '#a30d11', fontWeight: 600 }}>HS-{selectedRecord.recordId}</span></small>
          </div>
        </div>
        <button onClick={() => setShowDetail(false)} style={closeButtonStyle}><i className="bi bi-x-lg"></i></button>
      </div>
      
      <div style={{ padding: '24px 40px', maxHeight: '70vh', overflowY: 'auto' }}>
        {loadingDetail ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner-border text-danger" />
            <p style={{ marginTop: 12, color: '#64748b' }}>Đang tải chi tiết...</p>
          </div>
        ) : (
          <>
            {/* THÔNG TIN NGƯỜI NỘP THUẾ */}
            <SectionTitle icon="person-fill" title="Thông tin người nộp thuế" />
            <div style={{ display: 'flex', gap: '4%', marginBottom: 24 }}>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Họ và tên</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{selectedRecord.fullName || '—'}</div>
              </div>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Số CCCD/CMND</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{selectedRecord.senderCccd || '—'}</div>
              </div>
            </div>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 12, marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Địa chỉ thường trú</div>
              <div style={{ fontWeight: 500, fontSize: 14, color: '#1e293b' }}>{selectedRecord.address || '—'}</div>
            </div>

            {/* THÔNG TIN THỬA ĐẤT */}
            <SectionTitle icon="map" title="Thông tin thửa đất" />
            <div style={{ display: 'flex', gap: '4%', marginBottom: 12 }}>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Thửa đất số</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{selectedRecord.landParcelNumber || '—'}</div>
              </div>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Tờ bản đồ số</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{selectedRecord.mapSheetNumber || '—'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4%', marginBottom: 12 }}>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Diện tích</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{selectedRecord.area ? `${selectedRecord.area}m²` : '—'}</div>
              </div>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Loại đất</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{selectedRecord.landType || '—'}</div>
              </div>
            </div>
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 12, marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Địa chỉ thửa đất</div>
              <div style={{ fontWeight: 500, fontSize: 14, color: '#1e293b' }}>{selectedRecord.landAddress || selectedRecord.address || '—'}</div>
            </div>

            {/* NGHĨA VỤ TÀI CHÍNH */}
            <SectionTitle icon="cash-stack" title="Nghĩa vụ tài chính" />
            <div style={{ display: 'flex', gap: '4%', marginBottom: 12 }}>
              <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Loại thuế/Lệ phí</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{selectedRecord.taxType || 'Thuế sử dụng đất' || '—'}</div>
              </div>
              <div style={{ flex: 1, padding: '16px', background: '#fff1f2', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#a30d11', marginBottom: 8, textTransform: 'uppercase', fontWeight: 700 }}>Tổng tiền phải nộp</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#a30d11' }}>{selectedRecord.calculatedTaxAmount ? Number(selectedRecord.calculatedTaxAmount).toLocaleString('vi-VN') + 'đ' : '—'}</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={modalFooterStyle}>
        <button style={{ ...btnPrimary, background: '#a30d11' }}><i className="bi bi-pencil-square"></i> CẬP NHẬT</button>
        <button onClick={() => setShowDetail(false)} style={btnSecondary}>ĐÓNG</button>
      </div>
    </div>
  </div>
)}

        {/* 2. Modal Lựa chọn Xuất */}
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
                    <span style={{ color: '#a30d11', background: '#fff1f2', padding: '4px 12px', borderRadius: 12, fontWeight: 700, fontSize: 14 }}>HS-{selectedRecord.recordId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700 }}>CCCD</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{selectedRecord.senderCccd}</span>
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

        {/* 3. Modal Xem trước */}
{showPreview && selectedRecord && (
  <div style={{ ...modalOverlayStyle, zIndex: 6000 }}>
    <div style={{ ...modalContentStyle, maxWidth: 900, background: '#f1f5f9', height: '90vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ ...modalHeaderStyle, background: '#fff' }}>
        <div>
          <h5 style={{ margin: 0, fontWeight: 800 }}>Xem trước dữ liệu xuất</h5>
          <small style={{ color: '#64748b' }}>Định dạng: {exportFormat} | Hồ sơ: T-{new Date().getFullYear()}-{String(selectedRecord.recordId).padStart(3, '0')}</small>
        </div>
        <button onClick={() => setShowPreview(false)} style={closeButtonStyle}><i className="bi bi-x-lg"></i></button>
      </div>
      
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#fff', width: '100%', maxWidth: 750, padding: '60px 50px', borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative', fontFamily: 'Arial, sans-serif' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40, borderBottom: '2px solid #e2e8f0', paddingBottom: 20 }}>
            <p style={{ fontWeight: 700, margin: 0, fontSize: 12, textTransform: 'uppercase' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p style={{ fontSize: 11, margin: '4px 0 0', color: '#64748b' }}>Độc lập - Tự do - Hạnh phúc</p>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h3 style={{ fontWeight: 900, margin: 0, fontSize: 18, color: '#a30d11' }}>THÔNG BÁO NGHĨA VỤ TÀI CHÍNH</h3>
            <small style={{ color: '#64748b', fontWeight: 600, marginTop: 8, display: 'block' }}>Mã hồ sơ: T-{new Date().getFullYear()}-{String(selectedRecord.recordId).padStart(3, '0')}</small>
          </div>

          {/* THÔNG TIN NGƯỜI NỘP */}
          <div style={{ marginBottom: 28 }}>
            <h5 style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', margin: '0 0 16px', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: 8 }}>THÔNG TIN NGƯỜI NỘP</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Họ và tên</p>
                <p style={{ fontSize: 14, color: '#1e293b', margin: '4px 0 0', fontWeight: 600 }}>{selectedRecord.fullName || 'Trần Văn A'}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Số CCCD</p>
                <p style={{ fontSize: 14, color: '#1e293b', margin: '4px 0 0', fontWeight: 600 }}>{selectedRecord.senderCccd || '001090123456'}</p>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Địa chỉ thường trú</p>
              <p style={{ fontSize: 13, color: '#1e293b', margin: '4px 0 0', lineHeight: '1.5' }}>{selectedRecord.address || '123 Đường Kim Giang, Phường Thanh Liệt, Huyện Thanh Trì, TP. Hà Nội'}</p>
            </div>
          </div>

          {/* THÔNG TIN THỬA ĐẤT */}
          <div style={{ marginBottom: 28 }}>
            <h5 style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', margin: '0 0 16px', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: 8 }}>THÔNG TIN THỬA ĐẤT</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Thửa đất số</p>
                <p style={{ fontSize: 14, color: '#1e293b', margin: '4px 0 0', fontWeight: 600 }}>{selectedRecord.landParcelNumber || '101'}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Tờ bản đồ số</p>
                <p style={{ fontSize: 14, color: '#1e293b', margin: '4px 0 0', fontWeight: 600 }}>{selectedRecord.mapSheetNumber || '10'}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Diện tích</p>
                <p style={{ fontSize: 14, color: '#1e293b', margin: '4px 0 0', fontWeight: 600 }}>{selectedRecord.area || '120'}m²</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Loại đất</p>
                <p style={{ fontSize: 14, color: '#1e293b', margin: '4px 0 0', fontWeight: 600 }}>{selectedRecord.landType || 'Đất ở đô thị'}</p>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Địa chỉ thửa đất</p>
              <p style={{ fontSize: 13, color: '#1e293b', margin: '4px 0 0', lineHeight: '1.5' }}>{selectedRecord.landAddress || selectedRecord.address || '123 Đường Kim Giang, Phường Thanh Liệt, Huyện Thanh Trì, TP. Hà Nội'}</p>
            </div>
          </div>

          {/* CHI TIẾT NGHĨA VỤ TÀI CHÍNH */}
          <div style={{ marginBottom: 28 }}>
            <h5 style={{ fontWeight: 800, fontSize: 13, color: '#1e293b', margin: '0 0 16px', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: 8 }}>CHI TIẾT NGHĨA VỤ TÀI CHÍNH</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Loại thuế</p>
                <p style={{ fontSize: 14, color: '#1e293b', margin: '4px 0 0', fontWeight: 600 }}>{selectedRecord.taxType || 'Thuế sử dụng đất PNN'}</p>
              </div>
            </div>
            <div style={{ marginTop: 20, background: '#fff1f2', padding: '16px 20px', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#a30d11', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>Tổng số tiền phải nộp</p>
              <p style={{ fontSize: 22, color: '#a30d11', margin: '8px 0 0', fontWeight: 900 }}>{selectedRecord.calculatedTaxAmount ? Number(selectedRecord.calculatedTaxAmount).toLocaleString('vi-VN') + 'đ' : '1.200.000đ'}</p>
            </div>
          </div>

          {/* Footer Info */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginBottom: 24 }}>
            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, textAlign: 'center' }}>* Đây là bản xem trước dữ liệu xuất định dạng {exportFormat}.</p>
            <p style={{ fontSize: 10, color: '#94a3b8', margin: '4px 0 0', textAlign: 'center' }}>* Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>
          </div>

          {/* Signature */}
          <div style={{ textAlign: 'right', marginTop: 40 }}>
            <p style={{ fontWeight: 700, fontSize: 12, margin: 0, marginBottom: 60 }}>CƠ QUAN THUẾ</p>
            <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>(Ký và ghi rõ họ tên)</p>
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

        {/* Panel Tìm kiếm nâng cao */}
        {showAdvanced && (
          <div style={{ position: 'fixed', top: 120, right: 40, width: 380, background: '#fff', borderRadius: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', zIndex: 4000, padding: 24 }}>
            <h5 style={{ marginBottom: 20, fontWeight: 700 }}>BỘ LỌC TÌM KIẾM NÂNG CAO</h5>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>CCCD</label>
              <input type="text" placeholder="Nhập CCCD..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 6 }}>Trạng thái</label>
              <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}>
                <option>Tất cả</option>
                <option>Chờ duyệt</option>
                <option>Xác thực</option>
                <option>Duyệt</option>
                <option>Từ chối</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', background: '#f1f5f9', borderRadius: 8, fontWeight: 600 }}>Xóa bộ lọc</button>
              <button onClick={() => setShowAdvanced(false)} style={{ flex: 1, padding: '12px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </TaxOfficerLayout>
  );
};

const btnLarge = { 
  width: '100%', padding: '16px', border: 'none', 
  borderRadius: 50, fontWeight: 700, fontSize: 15, 
  cursor: 'pointer', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', gap: 10, transition: 'transform 0.1s' 
};

export default TaxRecords;