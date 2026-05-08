import React, { useState } from 'react';

// --- MOCK DATA ---
const MOCK_EXEMPTIONS = [
  { cccd: '098112233445', name: 'Nguyễn Văn Tiến', type: 'Người có công với cách mạng', discount: 'Giảm 100%' },
  { cccd: '023445566778', name: 'Trần Thị Mai', type: 'Hộ nghèo/Cận nghèo', discount: 'Giảm 50%' },
  { cccd: '056778899001', name: 'Lê Đình Quý', type: 'Thương binh hạng 1/4', discount: 'Giảm 100%' },
  { cccd: '011223344556', name: 'Phạm Hồng Thái', type: 'Người cao tuổi cô đơn', discount: 'Giảm 100%' },
];

const MOCK_REGIONS = [
  { id: 1, name: 'Phường Thanh Liệt', type: 'Khu vực ngoại thành cấp 1', limit: 150 },
  { id: 2, name: 'Phường Tân Triều', type: 'Khu vực ngoại thành cấp 1', limit: 120 },
  { id: 3, name: 'Xã Tả Thanh Oai', type: 'Khu vực ngoại thành cấp 2', limit: 200 },
];

const CategoryManagement = () => {
  // States
  const [isExemptModalOpen, setIsExemptModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  // Filter States cho Modal 1
  const [exemptSearch, setExemptSearch] = useState('');
  const [exemptType, setExemptType] = useState('Tất cả loại đối tượng');

  // Handlers
  const handleOpenConfig = (region) => {
    setSelectedRegion(region);
    setIsConfigModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Quản lý Danh mục</h2>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Quản lý các hạng mục gốc của hệ thống: Đối tượng miễn thuế, Hạn mức khu vực</p>
      </div>

      {/* Main Grid */}
      <div style={gridContainerStyle}>
        
        {/* Card 1: Đối tượng Miễn/Giảm thuế */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={{ ...iconBgStyle, backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
              <i className="bi bi-check-circle"></i>
            </div>
            <div>
              <h3 style={cardTitleStyle}>Đối tượng Miễn/Giảm thuế</h3>
              <p style={cardDescStyle}>Danh sách cá nhân được áp dụng chính sách giảm trừ</p>
            </div>
          </div>

          <div style={uploadBoxStyle}>
            <div style={uploadIconStyle}>
              <i className="bi bi-upload"></i>
            </div>
            <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Tải lên file Excel Danh sách</div>
            <div style={{ color: '#64748b', fontSize: 13 }}>Kéo thả file vào đây hoặc click để chọn<br/>(Chỉ nhận .xlsx)</div>
          </div>

          <div style={cardFooterStyle}>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Cập nhật lần cuối: 10:00 15/04/2026 (Admin)</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6' }}>1,245 Bản ghi</div>
            </div>
            <button style={btnPurpleOutlineStyle} onClick={() => setIsExemptModalOpen(true)}>
              Xem danh sách <i className="bi bi-chevron-right" style={{ fontSize: 10, marginLeft: 4 }}></i>
            </button>
          </div>
        </div>

        {/* Card 2: Hạn mức đất ở tối đa */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={{ ...iconBgStyle, backgroundColor: '#fffbeb', color: '#d97706' }}>
              <i className="bi bi-geo-alt"></i>
            </div>
            <div>
              <h3 style={cardTitleStyle}>Hạn mức đất ở tối đa (m2)</h3>
              <p style={cardDescStyle}>Cấu hình định mức cho từng Phường/Xã (Cơ sở tính thuế lũy tiến)</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MOCK_REGIONS.map(region => (
              <div key={region.id} style={regionItemStyle}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{region.name}</div>
                  <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{region.type}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontWeight: 800, color: '#1e293b' }}>{region.limit} m2</div>
                  <button style={btnIconStyle} onClick={() => handleOpenConfig(region)}>
                    <i className="bi bi-gear"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- MODAL 1: DANH SÁCH ĐỐI TƯỢNG MIỄN GIẢM --- */}
      {isExemptModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 800 }}>
            <div style={modalHeaderRedStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="bi bi-check-circle" style={{ fontSize: 18 }}></i>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Danh sách Đối tượng Miễn/Giảm thuế</h3>
              </div>
              <button onClick={() => setIsExemptModalOpen(false)} style={closeBtnStyle}><i className="bi bi-x"></i></button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Filter Bar */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div style={searchWrapperStyle}>
                  <i className="bi bi-search" style={searchIconStyle}></i>
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm theo CCCD hoặc Họ tên..." 
                    value={exemptSearch}
                    onChange={(e) => setExemptSearch(e.target.value)}
                    style={searchInputStyle}
                  />
                </div>
                <select 
                  value={exemptType}
                  onChange={(e) => setExemptType(e.target.value)}
                  style={selectStyle}
                >
                  <option>Tất cả loại đối tượng</option>
                  <option>Người có công với cách mạng</option>
                  <option>Hộ nghèo/Cận nghèo</option>
                  <option>Thương binh hạng 1/4</option>
                </select>
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                <thead>
                  <tr style={thRowStyle}>
                    <th style={thCellStyle}>SỐ CCCD</th>
                    <th style={thCellStyle}>HỌ VÀ TÊN</th>
                    <th style={thCellStyle}>LOẠI ĐỐI TƯỢNG</th>
                    <th style={thCellStyle}>MỨC MIỄN/GIẢM</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EXEMPTIONS.map((item, idx) => (
                    <tr key={idx} style={tdRowStyle}>
                      <td style={{ ...tdCellStyle, color: '#475569', fontFamily: 'monospace' }}>{item.cccd}</td>
                      <td style={{ ...tdCellStyle, fontWeight: 700, color: '#1e293b' }}>{item.name}</td>
                      <td style={{ ...tdCellStyle, color: '#64748b' }}>{item.type}</td>
                      <td style={tdCellStyle}>
                        <span style={discountBadgeStyle}>{item.discount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Hiển thị <span style={{ fontWeight: 700, color: '#1e293b' }}>1-4</span> trên <span style={{ fontWeight: 700, color: '#1e293b' }}>1,245</span> bản ghi
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={btnPageStyle}>Trang trước</button>
                  <button style={btnPageStyle}>Trang sau</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CẤU HÌNH HẠN MỨC --- */}
      {isConfigModalOpen && selectedRegion && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450 }}>
            <div style={modalHeaderRedStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="bi bi-geo-alt" style={{ fontSize: 18 }}></i>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cấu hình Hạn mức Đất ở</h3>
              </div>
              <button onClick={() => setIsConfigModalOpen(false)} style={closeBtnStyle}><i className="bi bi-x"></i></button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Alert Box */}
              <div style={alertBoxStyle}>
                <i className="bi bi-gear" style={{ fontSize: 18 }}></i>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  Hạn mức đất ở ảnh hưởng trực tiếp đến hệ số đóng thuế lũy tiến của bất động sản nằm trên địa bàn này.
                </div>
              </div>

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Đơn vị hành chính</label>
                  <input type="text" value={selectedRegion.name} readOnly style={inputDisabledStyle} />
                </div>
                
                <div>
                  <label style={labelStyle}>Phân loại khu vực</label>
                  <input type="text" value={selectedRegion.type} readOnly style={inputDisabledStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Hạn mức tối đa (m2)</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" defaultValue={selectedRegion.limit} style={inputActiveStyle} />
                    <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600, fontSize: 14 }}>m²</span>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Quyết định / Căn cứ áp dụng</label>
                  <input type="text" placeholder="Vd: QĐ 09/2026/UBND" style={inputActiveStyle} />
                </div>
              </div>

              {/* Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
                <button style={btnCancelStyle} onClick={() => setIsConfigModalOpen(false)}>Hủy bỏ</button>
                <button style={btnSaveRedStyle} onClick={() => setIsConfigModalOpen(false)}>Lưu cấu hình</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- STYLES ---

// Layout & Cards
const gridContainerStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 };
const cardStyle = { backgroundColor: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, display: 'flex', flexDirection: 'column' };
const cardHeaderStyle = { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 };
const iconBgStyle = { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 };
const cardTitleStyle = { margin: 0, fontSize: 16, fontWeight: 800, color: '#1e293b' };
const cardDescStyle = { margin: '4px 0 0', fontSize: 13, color: '#64748b' };

// Card 1 Specifics
const uploadBoxStyle = { border: '1px dashed #cbd5e1', borderRadius: 12, backgroundColor: '#f8fafc', padding: '40px 20px', textAlign: 'center', marginBottom: 20, cursor: 'pointer' };
const uploadIconStyle = { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #fecaca', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 18 };
const cardFooterStyle = { backgroundColor: '#faf5ff', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' };
const btnPurpleOutlineStyle = { backgroundColor: '#fff', border: '1px solid #ddd6fe', color: '#8b5cf6', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center' };

// Card 2 Specifics
const regionItemStyle = { border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' };
const btnIconStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#64748b', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

// Modals Common
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', width: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' };
const modalHeaderRedStyle = { backgroundColor: '#b91c1c', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' };
const closeBtnStyle = { background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center' };

// Modal 1 (Exempt List) Specifics
const searchWrapperStyle = { position: 'relative', flex: 1 };
const searchIconStyle = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const searchInputStyle = { width: '100%', padding: '10px 16px 10px 42px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' };
const selectStyle = { padding: '10px 16px', borderRadius: 8, border: '1px solid #fca5a5', color: '#1e293b', fontSize: 14, outline: 'none', backgroundColor: '#fff', cursor: 'pointer', minWidth: 220 };
const thRowStyle = { borderBottom: '1px solid #e2e8f0' };
const thCellStyle = { padding: '16px 0', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' };
const tdRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdCellStyle = { padding: '16px 0', fontSize: 14 };
const discountBadgeStyle = { backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 700 };
const btnPageStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#475569', padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' };

// Modal 2 (Config) Specifics
const alertBoxStyle = { backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: 16, borderRadius: 12, display: 'flex', gap: 12, marginBottom: 24 };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 800, color: '#334155', marginBottom: 8 };
const inputDisabledStyle = { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontSize: 14, outline: 'none' };
const inputActiveStyle = { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#1e293b', fontSize: 14, outline: 'none', fontWeight: 700 };
const btnCancelStyle = { padding: '10px 24px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnSaveRedStyle = { padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: '#b91c1c', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' };

export default CategoryManagement;