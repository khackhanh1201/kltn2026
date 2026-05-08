import React, { useState } from 'react';
// Giả định bạn có component Layout riêng
// import CadastralLayout from '../../components/CadastralLayout'; 

// --- MOCK DATA ---
const MOCK_COMPLAINTS = [
  { 
    id: 'KN-2026-001', 
    name: 'Nguyễn Văn A', 
    cccd: '001090123456',
    phone: '0912345678',
    email: 'vana@gmail.com',
    type: 'Khiếu nại mức giá đất', 
    date: '22/03/2026', 
    status: 'CHỜ XỬ LÝ',
    content: '"Mức thuế sử dụng đất phi nông nghiệp năm 2026 tăng quá cao so với năm 2025 (tăng 30%) trong khi diện tích và mục đích sử dụng đất không thay đổi. Đề nghị cơ quan địa chính xem xét lại cách tính."',
    files: ['don_kieu_nai.pdf', 'bien_lai_thue_2025.jpg'],
    history: [
      { action: 'Người dân gửi khiếu nại', user: 'Nguyễn Văn A', time: '22/03/2026 09:00', active: false },
      { action: 'Hệ thống tiếp nhận hồ sơ', user: 'Hệ thống', time: '22/03/2026 14:30', active: true },
    ]
  },
  { 
    id: 'KN-2026-002', 
    name: 'Lê Thị B', 
    cccd: '079192654321',
    phone: '0987654321',
    email: 'thib@gmail.com',
    type: 'Phản ánh sai sót thông tin', 
    date: '20/03/2026', 
    status: 'ĐANG XỬ LÝ',
    content: '"Thông tin địa chỉ trên thông báo nghĩa vụ tài chính bị sai lệch so với Giấy chứng nhận quyền sử dụng đất. Cần đính chính lại để tránh nhầm lẫn trong việc nộp thuế."',
    files: ['gcn_qsd_dat.pdf'],
    history: [
      { action: 'Người dân gửi phản ánh', user: 'Lê Thị B', time: '20/03/2026 10:15', active: false },
      { action: 'Cán bộ địa chính tiếp nhận xử lý', user: 'Nguyễn Thị Thu', time: '21/03/2026 08:30', active: true },
    ]
  },
  { 
    id: 'KN-2026-003', 
    name: 'Phạm Văn C', 
    cccd: '001085987654',
    phone: '0909090909',
    email: 'vanc@gmail.com',
    type: 'Khiếu nại miễn giảm tài chính', 
    date: '18/03/2026', 
    status: 'ĐÃ GIẢI QUYẾT',
    content: '"Gia đình tôi thuộc diện chính sách (thương binh hạng 2/4) nhưng chưa được áp dụng mức miễn giảm thuế sử dụng đất theo quy định. Tôi đã gửi kèm giấy tờ chứng minh."',
    files: ['the_thuong_binh.jpg', 'don_xin_mien_giam.pdf'],
    history: [
      { action: 'Người dân gửi hồ sơ miễn giảm', user: 'Phạm Văn C', time: '18/03/2026 15:20', active: false },
      { action: 'Cán bộ địa chính xác minh thông tin', user: 'Lê Văn Dũng', time: '19/03/2026 11:00', active: false },
      { action: 'Phê duyệt miễn giảm thuế', user: 'Trưởng chi nhánh', time: '20/03/2026 16:45', active: true },
    ]
  },
];

const ComplaintHandling = () => {
  const [view, setView] = useState('list'); // 'list' | 'detail'
  
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleViewDetail = (complaint) => {
    setSelectedComplaint(complaint);
    setView('detail');
  };

  // ================= VIEW: DANH SÁCH =================
  if (view === 'list') {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Xử lý khiếu nại</h2>
            <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Tiếp nhận và giải quyết các khiếu nại về nghĩa vụ tài chính</p>
          </div>
          
          <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
            <div style={searchWrapperStyle}>
              <i className="bi bi-search" style={searchIconStyle}></i>
              <input 
                type="text" 
                placeholder="Tìm kiếm mã khiếu nại, tên người dân..." 
                style={searchInputStyle}
              />
            </div>

            <button style={btnDarkRedStyle} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
              <i className="bi bi-funnel"></i> Tìm kiếm nâng cao
            </button>

            {/* Advanced Search Popover */}
            {showAdvancedSearch && (
              <div style={popoverStyle}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Bộ lọc tìm kiếm</h4>
                <div style={filterGridStyle}>
                  <div>
                    <label style={labelStyle}>TRẠNG THÁI</label>
                    <select style={inputBaseStyle}><option>Tất cả trạng thái</option></select>
                  </div>
                  <div>
                    <label style={labelStyle}>LOẠI KHIẾU NẠI</label>
                    <select style={inputBaseStyle}><option>Tất cả loại</option></select>
                  </div>
                  <div>
                    <label style={labelStyle}>TỪ NGÀY</label>
                    <input type="date" style={inputBaseStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>ĐẾN NGÀY</label>
                    <input type="date" style={inputBaseStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button style={btnCancelStyle} onClick={() => setShowAdvancedSearch(false)}>Xóa bộ lọc</button>
                  <button style={btnSaveRedStyle} onClick={() => setShowAdvancedSearch(false)}>Áp dụng</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div style={tableCardStyle}>
          {/* Tabs */}
          <div style={tabsWrapper}>
            {['Tất cả', 'Chờ xử lý', 'Đang xử lý', 'Đã giải quyết'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? tabActive : tabInactive}
              >
                {tab}
              </button>
            ))}
          </div>

          <table style={tableStyle}>
            <thead>
              <tr style={thRowStyle}>
                <th style={thCellStyle}>MÃ KHIẾU NẠI</th>
                <th style={thCellStyle}>NGƯỜI KHIẾU NẠI</th>
                <th style={thCellStyle}>LOẠI KHIẾU NẠI</th>
                <th style={thCellStyle}>NGÀY GỬI</th>
                <th style={thCellStyle}>TRẠNG THÁI</th>
                <th style={{ ...thCellStyle, textAlign: 'center' }}>THAO TÁC</th>
                <th style={{ ...thCellStyle, textAlign: 'center' }}>XUẤT HỒ SƠ</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_COMPLAINTS.map((item, idx) => (
                <tr key={idx} style={tdRowStyle}>
                  <td style={{ ...tdCellStyle, fontWeight: 700, color: '#1e293b' }}>{item.id}</td>
                  <td style={{ ...tdCellStyle, fontWeight: 700 }}>{item.name}</td>
                  <td style={{ ...tdCellStyle, color: '#64748b' }}>{item.type}</td>
                  <td style={{ ...tdCellStyle, color: '#64748b' }}>{item.date}</td>
                  <td style={tdCellStyle}><span style={getStatusBadge(item.status)}>{item.status}</span></td>
                  <td style={{ ...tdCellStyle, textAlign: 'center' }}>
                    <button style={iconBtnStyle} onClick={() => handleViewDetail(item)}>
                      <i className="bi bi-eye"></i>
                    </button>
                  </td>
                  <td style={{ ...tdCellStyle, textAlign: 'center' }}>
                    <button style={iconBtnStyle}><i className="bi bi-download"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ================= VIEW: CHI TIẾT =================
  if (view === 'detail' && selectedComplaint) {
    const c = selectedComplaint;
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <button onClick={() => setView('list')} style={btnBackStyle}><i className="bi bi-arrow-left"></i></button>
            <h3 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Chi tiết khiếu nại/phản ánh</h3>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {c.status === 'CHỜ XỬ LÝ' && (
              <button style={btnOrangeStyle}><i className="bi bi-check-circle"></i> Tiếp nhận</button>
            )}
            {c.status === 'ĐANG XỬ LÝ' && (
              <>
                <button style={btnRedRejectStyle}><i className="bi bi-x-circle"></i> Từ chối</button>
                <button style={btnGreenStyle}><i className="bi bi-send"></i> Cập nhật kết quả</button>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          
          {/* Cột trái (Nội dung & Lịch sử) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Nội dung khiếu nại */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: '#3b82f6' }}>
                  <i className="bi bi-chat-left-text"></i> Nội dung khiếu nại
                </div>
                <span style={getStatusBadge(c.status)}>{c.status}</span>
              </div>
              
              <div style={quoteBoxStyle}>{c.content}</div>

              <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', margin: '20px 0 12px', textTransform: 'uppercase' }}>TÀI LIỆU ĐÍNH KÊM</div>
              <div style={{ display: 'flex', gap: 16 }}>
                {c.files.map((file, idx) => (
                  <div key={idx} style={fileAttachmentStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className="bi bi-paperclip" style={{ color: '#3b82f6' }}></i>
                      <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{file}</span>
                    </div>
                    <i className="bi bi-download" style={{ color: '#94a3b8', cursor: 'pointer' }}></i>
                  </div>
                ))}
              </div>
            </div>

            {/* Lịch sử xử lý */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: '#1e293b', marginBottom: 24 }}>
                <i className="bi bi-clock-history"></i> Lịch sử xử lý
              </div>
              
              <div style={{ paddingLeft: 12 }}>
                {c.history.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 16, position: 'relative', paddingBottom: idx !== c.history.length - 1 ? 24 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: step.active ? '#2563eb' : '#e2e8f0', zIndex: 2 }}></div>
                      {idx !== c.history.length - 1 && <div style={{ width: 2, flex: 1, backgroundColor: '#f1f5f9' }}></div>}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: step.active ? '#1e293b' : '#475569' }}>{step.action}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                        <i className="bi bi-person" style={{ marginRight: 4 }}></i> {step.user} &nbsp;&nbsp;|&nbsp;&nbsp; 
                        <i className="bi bi-clock" style={{ margin: '0 4px 0 0' }}></i> {step.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Cột phải (Thông tin người khiếu nại) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={cardStyle}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9', paddingBottom: 12, marginBottom: 20 }}>
                THÔNG TIN NGƯỜI KHIẾU NẠI
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <InfoItem label="HỌ VÀ TÊN" value={c.name} bold />
                <InfoItem label="SỐ CCCD" value={c.cccd} />
                <InfoItem label="SỐ ĐIỆN THOẠI" value={c.phone} />
                <InfoItem label="EMAIL" value={c.email} />
                <InfoItem label="MÃ KHIẾU NẠI" value={c.id} color="#2563eb" bold />
                <InfoItem label="NGÀY GỬI" value={c.date} />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
};

// --- SUB-COMPONENTS & STYLES ---

const InfoItem = ({ label, value, bold, color }) => (
  <div>
    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: bold ? 700 : 600, color: color || '#1e293b' }}>{value}</div>
  </div>
);

const getStatusBadge = (s) => {
  const base = { padding: '6px 12px', borderRadius: 50, fontSize: 11, fontWeight: 800 };
  if (s === 'CHỜ XỬ LÝ') return { ...base, backgroundColor: '#fef3c7', color: '#d97706' };
  if (s === 'ĐANG XỬ LÝ') return { ...base, backgroundColor: '#dbeafe', color: '#2563eb' };
  if (s === 'ĐÃ GIẢI QUYẾT') return { ...base, backgroundColor: '#dcfce7', color: '#16a34a' };
  return base;
};

// Filter & Buttons
const searchWrapperStyle = { position: 'relative', width: 320 };
const searchIconStyle = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const searchInputStyle = { width: '100%', padding: '10px 16px 10px 42px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' };
const btnDarkRedStyle = { backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', gap: 8 };

// Table & Tabs
const tableCardStyle = { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' };
const tabsWrapper = { display: 'flex', gap: 8, padding: '16px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' };
const tabInactive = { backgroundColor: 'transparent', color: '#64748b', border: 'none', padding: '8px 20px', borderRadius: 50, fontWeight: 700, fontSize: 13, cursor: 'pointer' };
const tabActive = { ...tabInactive, backgroundColor: '#fff', color: '#1e293b', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRowStyle = { borderBottom: '1px solid #e2e8f0' };
const thCellStyle = { padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' };
const tdRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdCellStyle = { padding: '16px 24px', fontSize: 14 };
const iconBtnStyle = { background: '#f8fafc', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', color: '#64748b' };

// Popover
const popoverStyle = { position: 'absolute', top: '120%', right: 0, width: 400, backgroundColor: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid #f1f5f9', zIndex: 100 };
const filterGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', marginBottom: 6 };
const inputBaseStyle = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', backgroundColor: '#f8fafc' };
const btnCancelStyle = { flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnSaveRedStyle = { flex: 1, padding: '10px', borderRadius: 8, border: 'none', backgroundColor: '#b91c1c', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' };

// Detail Layout
const btnBackStyle = { width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: 16 };
const cardStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 30 };
const quoteBoxStyle = { fontStyle: 'italic', color: '#475569', backgroundColor: '#f8fafc', padding: 24, borderRadius: 12, borderLeft: '4px solid #cbd5e1', fontSize: 14, lineHeight: 1.6 };
const fileAttachmentStyle = { flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 };

// Action Buttons
const btnOrangeStyle = { backgroundColor: '#ea580c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', gap: 8 };
const btnRedRejectStyle = { backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', gap: 8 };
const btnGreenStyle = { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', gap: 8 };

export default ComplaintHandling;