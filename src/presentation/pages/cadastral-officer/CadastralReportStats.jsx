import React, { useState } from 'react';
import CadastralLayout from '../../components/CadastralLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';
// --- MOCK DATA ---
const MOCK_TABLE_DATA = [
  { id: 1, unit: 'Thanh Liệt', total: 450, resolved: 420, pending: 30, rate: 93 },
  { id: 2, unit: 'Tân Triều', total: 380, resolved: 340, pending: 40, rate: 89 },
  { id: 3, unit: 'Tả Thanh Oai', total: 415, resolved: 360, pending: 55, rate: 87 },
  { id: 4, unit: 'Hữu Hòa', total: 320, resolved: 300, pending: 20, rate: 94 },
  { id: 5, unit: 'Tam Hiệp', total: 290, resolved: 275, pending: 15, rate: 95 },
];

const CadastralReportStats = () => {
  // Navigation & Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reportFormat, setReportFormat] = useState('pdf');
  const { user } = useUserInfo(); 
  return (
    <CadastralLayout user={user}>
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Báo cáo Thống kê Địa chính</h2>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Tổng hợp số liệu về quản lý đất đai, cấp GCN và giải quyết khiếu nại</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={btnRedStyle} onClick={() => setIsCreateModalOpen(true)}>
            <i className="bi bi-plus"></i> Tạo báo cáo mới
          </button>
          <button style={btnWhiteStyle}>
            <i className="bi bi-download"></i> Xuất báo cáo PDF
          </button>
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={sectionTitleStyle}>Lọc thống kê theo yêu cầu</h4>
        <div style={filterBarStyle}>
          <select style={selectInputStyle}>
            <option>Báo cáo tổng hợp</option>
            <option>Báo cáo cấp GCN</option>
            <option>Báo cáo khiếu nại</option>
          </select>
          <select style={selectInputStyle}>
            <option>Tháng này</option>
            <option>Quý này</option>
            <option>Năm nay</option>
          </select>
          <select style={selectInputStyle}>
            <option>Tất cả khu vực</option>
            <option>Thanh Liệt</option>
            <option>Tân Triều</option>
          </select>
          <button style={btnDarkStyle}>
            <i className="bi bi-funnel"></i> Xem dữ liệu
          </button>
        </div>
      </div>

      {/* --- KPI CARDS (Thống kê hồ sơ xử lý) --- */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={sectionTitleStyle}>Thống kê hồ sơ xử lý</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <KpiCard 
            icon="file-earmark-text" title="TỔNG TIẾP NHẬN" value="1,245" subtext="+12.5% so với kỳ trước" 
            themeColor="#3b82f6" bgColor="#eff6ff" 
          />
          <KpiCard 
            icon="check-circle" title="ĐÃ GIẢI QUYẾT" value="1,120" subtext="Tỷ lệ hoàn thành: 90%" 
            themeColor="#10b981" bgColor="#ecfdf5" 
          />
          <KpiCard 
            icon="clock-history" title="ĐANG XỬ LÝ" value="125" subtext="Trong hạn quy định" 
            themeColor="#f59e0b" bgColor="#fffbeb" 
          />
          <KpiCard 
            icon="exclamation-triangle" title="HỒ SƠ TRỄ HẠN" value="0" subtext="Tuyệt vời!" 
            themeColor="#ef4444" bgColor="#fef2f2" 
          />
        </div>
      </div>

      {/* --- CHARTS ROW 1 --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        
        {/* Bar Chart Dọc */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <i className="bi bi-bar-chart" style={{ color: '#64748b' }}></i> Tiếp nhận hồ sơ theo loại
          </div>
          <div style={{ height: 250, width: '100%' }}>
            <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="600" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="600" y2="170" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="220" x2="600" y2="220" stroke="#e2e8f0" strokeWidth="1" />

              {/* Y-Axis */}
              <text x="30" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">400</text>
              <text x="30" y="74" fill="#94a3b8" fontSize="10" textAnchor="end">300</text>
              <text x="30" y="124" fill="#94a3b8" fontSize="10" textAnchor="end">200</text>
              <text x="30" y="174" fill="#94a3b8" fontSize="10" textAnchor="end">100</text>
              <text x="30" y="224" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>

              {/* Bars */}
              <rect x="100" y="20" width="16" height="200" fill="#3b82f6" rx="2" />
              <rect x="220" y="70" width="16" height="150" fill="#3b82f6" rx="2" />
              <rect x="340" y="120" width="16" height="100" fill="#3b82f6" rx="2" />
              <rect x="460" y="140" width="16" height="80" fill="#3b82f6" rx="2" />
              <rect x="580" y="120" width="16" height="100" fill="#3b82f6" rx="2" />

              {/* X-Axis */}
              <text x="108" y="240" fill="#64748b" fontSize="9" textAnchor="middle">Cấp mới GCN</text>
              <text x="228" y="240" fill="#64748b" fontSize="9" textAnchor="middle">Chuyển nhượng</text>
              <text x="348" y="240" fill="#64748b" fontSize="9" textAnchor="middle">Tặng cho</text>
              <text x="468" y="240" fill="#64748b" fontSize="9" textAnchor="middle">Thừa kế</text>
              <text x="588" y="240" fill="#64748b" fontSize="9" textAnchor="middle">Thế chấp</text>
            </svg>
          </div>
        </div>

        {/* Donut Chart */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <i className="bi bi-pie-chart" style={{ color: '#64748b' }}></i> Tỷ lệ giải quyết khiếu nại
          </div>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '20px auto 10px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="4" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="85, 100" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="65, 100" />
            </svg>
            <div style={donutCenterText}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>100</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', marginTop: 4 }}>TỔNG KHIẾU NẠI</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 10, fontWeight: 600, color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }}></div> Từ chối</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }}></div> Đang xử lý</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}></div> Đã giải quyết</span>
          </div>
        </div>

      </div>

      {/* --- CHARTS ROW 2 (Thống kê theo khu vực) --- */}
      <div>
        <h4 style={sectionTitleStyle}>Thống kê theo khu vực</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          
          {/* Bar Chart Ngang */}
          <div style={cardStyle}>
            <div style={{...cardHeaderStyle, justifyContent: 'center'}}>
              <div style={{ display: 'flex', gap: 16, fontSize: 10, fontWeight: 600, color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#94a3b8' }}></div> Tiếp nhận</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}></div> Đã giải quyết</span>
              </div>
            </div>
            
            <div style={{ height: 220, width: '100%', marginTop: 10 }}>
              <svg width="100%" height="100%" viewBox="0 0 400 220" preserveAspectRatio="none">
                {/* Y-Axis Labels */}
                <text x="60" y="20" fill="#64748b" fontSize="10" textAnchor="end">Thanh Liệt</text>
                <text x="60" y="60" fill="#64748b" fontSize="10" textAnchor="end">Tân Triều</text>
                <text x="60" y="100" fill="#64748b" fontSize="10" textAnchor="end">Tả Thanh Oai</text>
                <text x="60" y="140" fill="#64748b" fontSize="10" textAnchor="end">Hữu Hòa</text>
                <text x="60" y="180" fill="#64748b" fontSize="10" textAnchor="end">Tam Hiệp</text>

                {/* Bars - Thanh Liệt */}
                <rect x="70" y="10" width="280" height="8" fill="#94a3b8" rx="2" />
                <rect x="70" y="20" width="260" height="8" fill="#10b981" rx="2" />
                
                {/* Bars - Tân Triều */}
                <rect x="70" y="50" width="220" height="8" fill="#94a3b8" rx="2" />
                <rect x="70" y="60" width="200" height="8" fill="#10b981" rx="2" />

                {/* Bars - Tả Thanh Oai */}
                <rect x="70" y="90" width="250" height="8" fill="#94a3b8" rx="2" />
                <rect x="70" y="100" width="220" height="8" fill="#10b981" rx="2" />

                {/* Bars - Hữu Hòa */}
                <rect x="70" y="130" width="200" height="8" fill="#94a3b8" rx="2" />
                <rect x="70" y="140" width="180" height="8" fill="#10b981" rx="2" />

                {/* Bars - Tam Hiệp */}
                <rect x="70" y="170" width="180" height="8" fill="#94a3b8" rx="2" />
                <rect x="70" y="180" width="170" height="8" fill="#10b981" rx="2" />

                {/* X-Axis */}
                <line x1="70" y1="200" x2="400" y2="200" stroke="#e2e8f0" strokeWidth="1" />
                <text x="70" y="215" fill="#94a3b8" fontSize="9" textAnchor="middle">0</text>
                <text x="180" y="215" fill="#94a3b8" fontSize="9" textAnchor="middle">150</text>
                <text x="290" y="215" fill="#94a3b8" fontSize="9" textAnchor="middle">300</text>
                <text x="400" y="215" fill="#94a3b8" fontSize="9" textAnchor="end">600</text>
              </svg>
            </div>
          </div>

          {/* Table Chi tiết */}
          <div style={cardStyle}>
            <div style={{ ...cardHeaderStyle, justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>Chi tiết theo Đơn vị hành chính (Xã/Phường)</span>
              <span style={{ fontSize: 12, color: '#b91c1c', cursor: 'pointer', fontWeight: 600 }}>Xuất Excel</span>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={thStyle}>ĐƠN VỊ</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>TỔNG TIẾP NHẬN</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>ĐÃ GIẢI QUYẾT</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>ĐANG XỬ LÝ</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>TỶ LỆ HOÀN THÀNH</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TABLE_DATA.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#1e293b' }}>{row.unit}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>{row.total}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{row.resolved}</td>
                    <td style={{ ...tdCellStyle, textAlign: 'center', color: '#f59e0b' }}>{row.pending}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <div style={{ width: 60, height: 6, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${row.rate}%`, height: '100%', backgroundColor: '#10b981' }}></div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', width: 28 }}>{row.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL TẠO BÁO CÁO --- */}
      {isCreateModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            {/* Modal Header */}
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Tạo báo cáo thống kê theo yêu cầu</h3>
              <button onClick={() => setIsCreateModalOpen(false)} style={closeBtnStyle}><i className="bi bi-x"></i></button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div>
                <label style={labelStyle}>Tên báo cáo</label>
                <input type="text" placeholder="VD: Báo cáo biến động đất đai Quý 3/2026" style={inputModalStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Loại dữ liệu thống kê</label>
                  {/* Trạng thái lỗi/focus (viền đỏ) giống trong ảnh 2 */}
                  <select style={{ ...inputModalStyle, border: '1px solid #b91c1c' }}>
                    <option>Hồ sơ địa chính (Cấp đổi/Cấp mới)</option>
                    <option>Khiếu nại/Tố cáo</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Khu vực</label>
                  <select style={inputModalStyle}>
                    <option>Toàn Huyện</option>
                    <option>Thanh Liệt</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Từ ngày</label>
                  <input type="date" style={inputModalStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Đến ngày</label>
                  <input type="date" style={inputModalStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Định dạng xuất báo cáo</label>
                <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                  <label style={radioLabelStyle}>
                    <input type="radio" name="format" value="pdf" checked={reportFormat === 'pdf'} onChange={() => setReportFormat('pdf')} style={radioInputStyle} /> 
                    Tệp PDF (.pdf)
                  </label>
                  <label style={radioLabelStyle}>
                    <input type="radio" name="format" value="excel" checked={reportFormat === 'excel'} onChange={() => setReportFormat('excel')} style={radioInputStyle} /> 
                    Tệp Excel (.xlsx)
                  </label>
                  <label style={radioLabelStyle}>
                    <input type="radio" name="format" value="word" checked={reportFormat === 'word'} onChange={() => setReportFormat('word')} style={radioInputStyle} /> 
                    Tệp Word (.docx)
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={modalFooterStyle}>
              <button style={btnCancelStyle} onClick={() => setIsCreateModalOpen(false)}>Hủy bỏ</button>
              <button style={btnSaveRedStyle} onClick={() => setIsCreateModalOpen(false)}>
                <i className="bi bi-plus"></i> Tạo báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </CadastralLayout>
  );
};

// --- SUB-COMPONENTS ---

const KpiCard = ({ icon, title, value, subtext, themeColor, bgColor }) => (
  <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: bgColor, color: themeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
      <i className={`bi bi-${icon}`}></i>
    </div>
    <div>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', lineHeight: 1.2, margin: '2px 0' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b' }}>{subtext}</div>
    </div>
  </div>
);

// --- STYLES ---

// Headers & Text
const sectionTitleStyle = { margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1e293b' };

// Buttons
const btnRedStyle = { backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' };
const btnWhiteStyle = { backgroundColor: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' };
const btnDarkStyle = { backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' };

// Filter Bar
const filterBarStyle = { display: 'flex', gap: 12, backgroundColor: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' };
const selectInputStyle = { flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, color: '#1e293b', outline: 'none', appearance: 'none', backgroundColor: '#f8fafc', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '10px auto' };

// Cards & Charts
const cardStyle = { backgroundColor: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 };
const cardHeaderStyle = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: 12, marginBottom: 16 };
const donutCenterText = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };

// Table inside Card
const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' };
const tdStyle = { padding: '16px', fontSize: 13 };
const tdCellStyle = { ...tdStyle, color: '#475569' };

// Modal Styles
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', width: '100%', maxWidth: 600, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' };
const modalHeaderStyle = { padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeBtnStyle = { background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 };
const inputModalStyle = { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', color: '#1e293b' };
const radioLabelStyle = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#334155', cursor: 'pointer' };
const radioInputStyle = { width: 16, height: 16, accentColor: '#2563eb', cursor: 'pointer' };
const modalFooterStyle = { padding: '24px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #f1f5f9' };
const btnCancelStyle = { padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', color: '#475569', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnSaveRedStyle = { padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: '#b91c1c', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' };

export default CadastralReportStats;