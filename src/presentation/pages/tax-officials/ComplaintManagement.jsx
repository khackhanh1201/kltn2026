import React, { useState } from 'react';
import TaxOfficerLayout from '../../components/TaxOfficerLayout';

const ComplaintManagement = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  
  // Navigation State
  const [view, setView] = useState('list'); // 'list' | 'detail'
  
  // List States
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Mock Data
  const complaints = [
    { id: 'KN-2026-001', name: 'Nguyễn Văn A', type: 'Khiếu nại mức thuế', date: '22/03/2026', status: 'CHỜ XỬ LÝ', phone: '0912345678', email: 'vana@gmail.com', cccd: '001090123456', content: '"Mức thuế sử dụng đất phi nông nghiệp năm 2026 tăng quá cao so với năm 2025 (tăng 30%) trong khi diện tích và mục đích sử dụng đất không thay đổi. Đề nghị cơ quan thuế xem xét lại cách tính."' },
    { id: 'KN-2026-002', name: 'Lê Thị B', type: 'Phản ánh sai sót thông tin', date: '20/03/2026', status: 'ĐANG XỬ LÝ' },
    { id: 'KN-2026-003', name: 'Phạm Văn C', type: 'Khiếu nại miễn giảm thuế', date: '18/03/2026', status: 'ĐÃ GIẢI QUYẾT' },
  ];

  // ================= VIEW: DANH SÁCH =================
  if (view === 'list') {
    return (
      <TaxOfficerLayout user={user}>
        <div style={containerStyle}>
          
          {/* Header & Search */}
          <div style={headerStyle}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800 }}>Xử lý khiếu nại</h2>
              <p style={{ color: '#64748b', marginTop: 4 }}>Tiếp nhận và giải quyết các khiếu nại về nghĩa vụ thuế</p>
            </div>
            
            <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
              <div style={searchWrapper}>
                <i className="bi bi-search" style={searchIcon}></i>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mã khiếu nại, tên người dân..." 
                  style={searchInput} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <button 
                style={btnAdvancedSearch}
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              >
                <i className="bi bi-filter" /> Tìm kiếm nâng cao
              </button>

              {/* Advanced Filter Popover */}
              {showAdvancedFilter && (
                <div style={filterPopoverStyle}>
                  <h4 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700 }}>Bộ lọc tìm kiếm</h4>
                  <div style={filterGridStyle}>
                    <FilterSelect label="TRẠNG THÁI" options={['Tất cả trạng thái', 'Chờ xử lý', 'Đang xử lý', 'Đã giải quyết']} />
                    <FilterSelect label="LOẠI KHIẾU NẠI" options={['Tất cả loại', 'Khiếu nại mức thuế', 'Phản ánh sai sót', 'Miễn giảm thuế']} />
                    <FilterInput label="TỪ NGÀY" type="date" />
                    <FilterInput label="ĐẾN NGÀY" type="date" />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 25 }}>
                    <button style={btnResetFilter} onClick={() => setShowAdvancedFilter(false)}>Xóa bộ lọc</button>
                    <button style={btnApplyFilter} onClick={() => setShowAdvancedFilter(false)}>Áp dụng</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div style={cardTableStyle}>
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
                <tr style={thRow}>
                  <th>MÃ KHIẾU NẠI</th>
                  <th>NGƯỜI KHIẾU NẠI</th>
                  <th>LOẠI KHIẾU NẠI</th>
                  <th>NGÀY GỬI</th>
                  <th>TRẠNG THÁI</th>
                  <th style={{ textAlign: 'center' }}>THAO TÁC</th>
                  <th style={{ textAlign: 'center' }}>XUẤT HỒ SƠ</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id} style={tdRow}>
                    <td style={{ fontWeight: 700 }}>{c.id}</td>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td style={{ color: '#64748b' }}>{c.type}</td>
                    <td style={{ color: '#64748b' }}>{c.date}</td>
                    <td><span style={getStatusBadge(c.status)}>{c.status}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        style={iconBtn} 
                        onClick={() => { setSelectedComplaint(c); setView('detail'); }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button style={iconBtn}><i className="bi bi-download"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TaxOfficerLayout>
    );
  }

  // ================= VIEW: CHI TIẾT =================
  if (view === 'detail' && selectedComplaint) {
    const c = selectedComplaint;
    return (
      <TaxOfficerLayout user={user}>
        <div style={containerStyle}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <button onClick={() => setView('list')} style={btnBack}><i className="bi bi-arrow-left"></i></button>
                <h3 style={{ margin: 0, fontWeight: 800 }}>Chi tiết khiếu nại/phản ánh</h3>
             </div>
             <button style={btnAcceptAction}><i className="bi bi-check2-circle"></i> Tiếp nhận</button>
          </div>

          <div style={detailGrid}>
            {/* Cột trái: Nội dung & Lịch sử */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Nội dung khiếu nại */}
              <div style={contentCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1e293b' }}>
                    <i className="bi bi-chat-left-text" style={{ color: '#3b82f6' }}></i> Nội dung khiếu nại
                  </div>
                  <span style={getStatusBadge(c.status)}>{c.status}</span>
                </div>
                
                <div style={quoteBox}>{c.content || "Nội dung phản ánh..."}</div>

                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', margin: '20px 0 10px', textTransform: 'uppercase' }}>Tài liệu đính kèm</div>
                <div style={{ display: 'flex', gap: 15 }}>
                  <div style={fileAttachment}>
                    <i className="bi bi-paperclip" style={{ color: '#3b82f6' }}></i> don_kieu_nai.pdf
                    <i className="bi bi-download" style={{ marginLeft: 'auto', cursor: 'pointer', color: '#94a3b8' }}></i>
                  </div>
                  <div style={fileAttachment}>
                    <i className="bi bi-paperclip" style={{ color: '#3b82f6' }}></i> bien_lai_thue_2025.jpg
                    <i className="bi bi-download" style={{ marginLeft: 'auto', cursor: 'pointer', color: '#94a3b8' }}></i>
                  </div>
                </div>
              </div>

              {/* Lịch sử xử lý */}
              <div style={contentCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1e293b', marginBottom: 25 }}>
                  <i className="bi bi-clock-history"></i> Lịch sử xử lý
                </div>
                <div style={{ paddingLeft: 10 }}>
                  <TimelineItem 
                    title="Người dân gửi khiếu nại" 
                    user={`Người dân - ${c.name}`} 
                    time={`${c.date} 09:00`} 
                  />
                  <TimelineItem 
                    title="Hệ thống tiếp nhận hồ sơ" 
                    user="Hệ thống tự động" 
                    time={`${c.date} 14:30`} 
                    active 
                  />
                </div>
              </div>
            </div>

            {/* Cột phải: Thông tin & Ghi chú */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Thông tin người khiếu nại */}
              <div style={contentCard}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginBottom: 15 }}>
                  Thông tin người khiếu nại
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                  <InfoRow label="HỌ VÀ TÊN" value={c.name} bold />
                  <InfoRow label="SỐ CCCD" value={c.cccd} />
                  <InfoRow label="SỐ ĐIỆN THOẠI" value={c.phone} />
                  <InfoRow label="EMAIL" value={c.email} />
                  <InfoRow label="MÃ KHIẾU NẠI" value={c.id} color="#3b82f6" />
                  <InfoRow label="NGÀY GỬI" value={c.date} />
                </div>
              </div>

              {/* Ghi chú nội bộ */}
              <div style={noteCard}>
                <div style={{ fontWeight: 700, marginBottom: 15 }}>Ghi chú nội bộ</div>
                <textarea 
                  placeholder="Nhập ghi chú cho cán bộ khác..." 
                  style={textareaStyle}
                  rows={4}
                ></textarea>
                <button style={btnSaveNote}>Lưu ghi chú</button>
              </div>

            </div>
          </div>
        </div>
      </TaxOfficerLayout>
    );
  }
};

// --- Sub-Components ---
const FilterInput = ({ label, placeholder, type = "text" }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{label}</label>
    <input type={type} placeholder={placeholder} style={filterInputBaseStyle} />
  </div>
);

const FilterSelect = ({ label, options }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{label}</label>
    <select style={filterInputBaseStyle}>
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);

const TimelineItem = ({ title, user, time, active }) => (
  <div style={{ display: 'flex', gap: 15, position: 'relative', paddingBottom: 25 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       <div style={{ width: 12, height: 12, borderRadius: '50%', background: active ? '#3b82f6' : '#e2e8f0', zIndex: 2 }}></div>
       <div style={{ width: 2, flex: 1, background: '#f1f5f9' }}></div>
    </div>
    <div>
       <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#1e293b' : '#64748b' }}>{title}</div>
       <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
         <i className="bi bi-person" style={{ marginRight: 4 }}></i> {user} &nbsp;|&nbsp; 
         <i className="bi bi-clock" style={{ margin: '0 4px 0 8px' }}></i> {time}
       </div>
    </div>
  </div>
);

const InfoRow = ({ label, value, bold, color }) => (
  <div>
    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: bold ? 700 : 500, color: color || '#1e293b' }}>{value}</div>
  </div>
);

const getStatusBadge = (s) => {
  const base = { padding: '4px 12px', borderRadius: 50, fontSize: 10, fontWeight: 800 };
  if (s === 'CHỜ XỬ LÝ') return { ...base, background: '#fef3c7', color: '#d97706' };
  if (s === 'ĐANG XỬ LÝ') return { ...base, background: '#dbeafe', color: '#2563eb' };
  if (s === 'ĐÃ GIẢI QUYẾT') return { ...base, background: '#dcfce7', color: '#16a34a' };
  return base;
};

// --- Styles ---
const containerStyle = { padding: '24px 32px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 };

const searchWrapper = { position: 'relative', width: 350 };
const searchIcon = { position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const searchInput = { width: '100%', padding: '10px 15px 10px 40px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' };
const btnAdvancedSearch = { padding: '10px 20px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };

const filterPopoverStyle = { position: 'absolute', top: '110%', right: 0, width: 450, background: '#fff', borderRadius: 24, padding: 30, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', zIndex: 1000, border: '1px solid #f1f5f9' };
const filterGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px' };
const filterInputBaseStyle = { padding: '12px', borderRadius: 12, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 14, outline: 'none' };
const btnResetFilter = { flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff', fontWeight: 700, cursor: 'pointer' };
const btnApplyFilter = { flex: 1, padding: '12px', border: 'none', borderRadius: 12, background: '#a30d11', color: '#fff', fontWeight: 700, cursor: 'pointer' };

const cardTableStyle = { background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9', overflow: 'hidden' };
const tabsWrapper = { display: 'flex', gap: 8, padding: '20px 24px', borderBottom: '1px solid #f1f5f9' };
const tabInactive = { background: '#f8fafc', color: '#64748b', border: 'none', padding: '8px 20px', borderRadius: 50, fontWeight: 600, fontSize: 13, cursor: 'pointer' };
const tabActive = { ...tabInactive, background: '#f1f5f9', color: '#1e293b' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRow = { textAlign: 'left', background: '#fff', color: '#94a3b8', fontSize: 11, letterSpacing: '0.5px' };
const tdRow = { borderBottom: '1px solid #f1f5f9', fontSize: 14 };
const iconBtn = { background: '#f8fafc', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', color: '#64748b' };

const btnBack = { width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const btnAcceptAction = { background: '#f97316', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };

const detailGrid = { display: 'grid', gridTemplateColumns: '1fr 350px', gap: 20 };
const contentCard = { background: '#fff', borderRadius: 16, padding: 25, border: '1px solid #f1f5f9' };
const quoteBox = { fontStyle: 'italic', color: '#475569', background: '#f8fafc', padding: 20, borderRadius: 12, borderLeft: '4px solid #cbd5e1' };
const fileAttachment = { flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, fontSize: 13, fontWeight: 600 };

const noteCard = { background: '#0f172a', color: '#fff', borderRadius: 16, padding: 25 };
const textareaStyle = { width: '100%', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: 12, padding: 15, outline: 'none', resize: 'none', fontSize: 13 };
const btnSaveNote = { width: '100%', padding: '12px', background: '#fff', color: '#0f172a', border: 'none', borderRadius: 8, fontWeight: 700, marginTop: 15, cursor: 'pointer' };

export default ComplaintManagement;