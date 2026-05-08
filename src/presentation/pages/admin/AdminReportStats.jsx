import React from 'react';

const AdminReportStats = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Báo cáo - Thống kê</h2>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Xuất dữ liệu và phân tích lưu lượng, hiệu suất nền tảng</p>
      </div>

      {/* Top KPI Cards */}
      <div style={topCardsContainer}>
        {/* Card 1: Truy cập SSO */}
        <div style={kpiCardStyle}>
          <div style={kpiTitleStyle}>TRUY CẬP SSO (THÁNG)</div>
          <div style={kpiValueStyle}>345,120</div>
          <div style={{ color: '#16a34a', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="bi bi-graph-up-arrow"></i> +8.2%
          </div>
        </div>

        {/* Card 2: Hồ sơ luân chuyển */}
        <div style={kpiCardStyle}>
          <div style={kpiTitleStyle}>HỒ SƠ LUÂN CHUYỂN (THUẾ & ĐC)</div>
          <div style={kpiValueStyle}>12,850</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>Đã liên thông thành công</div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={chartCardStyle}>
        <div style={chartHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1e293b' }}>
            <i className="bi bi-people" style={{ color: '#3b82f6', fontSize: 18 }}></i>
            Lưu lượng Đăng nhập SSO (7 ngày qua)
          </div>
          <button style={btnExportCsvStyle}>
            <i className="bi bi-download"></i> Xuất CSV
          </button>
        </div>

        <div style={chartContainerStyle}>
          {/* SVG Mockup Chart */}
          <svg width="100%" height="100%" viewBox="0 0 1000 250" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines (Horizontal) */}
            <line x1="50" y1="20" x2="1000" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="70" x2="1000" y2="70" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="120" x2="1000" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="170" x2="1000" y2="170" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="220" x2="1000" y2="220" stroke="#e2e8f0" strokeWidth="1" />

            {/* Area Path */}
            <path 
              d="M 50 110 L 200 105 L 350 108 L 500 110 L 650 90 L 800 85 L 950 70 L 950 220 L 50 220 Z" 
              fill="url(#areaGradient)" 
            />
            {/* Line Path */}
            <path 
              d="M 50 110 L 200 105 L 350 108 L 500 110 L 650 90 L 800 85 L 950 70" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2" 
            />

            {/* Data Point Dot for Tooltip */}
            <circle cx="650" cy="90" r="4" fill="#3b82f6" />
            <circle cx="650" cy="90" r="8" fill="#3b82f6" fillOpacity="0.2" />
            
            {/* Tooltip Mockup */}
            <g transform="translate(660, 95)">
              <rect x="0" y="0" width="100" height="46" rx="8" fill="#fff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" stroke="#e2e8f0" strokeWidth="1" />
              <text x="12" y="18" fill="#1e293b" fontSize="11" fontWeight="700">16/04</text>
              <text x="12" y="34" fill="#3b82f6" fontSize="11" fontWeight="600">logins : 11000</text>
            </g>

            {/* Y-Axis Labels */}
            <text x="40" y="24" fill="#94a3b8" fontSize="10" textAnchor="end">14000</text>
            <text x="40" y="74" fill="#94a3b8" fontSize="10" textAnchor="end">10500</text>
            <text x="40" y="124" fill="#94a3b8" fontSize="10" textAnchor="end">7000</text>
            <text x="40" y="174" fill="#94a3b8" fontSize="10" textAnchor="end">3500</text>
            <text x="40" y="224" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>

            {/* X-Axis Labels */}
            <text x="50" y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">12/04</text>
            <text x="200" y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">13/04</text>
            <text x="350" y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">14/04</text>
            <text x="500" y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">15/04</text>
            <text x="650" y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">16/04</text>
            <text x="800" y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">17/04</text>
            <text x="950" y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">18/04</text>
          </svg>
        </div>
      </div>

      {/* Custom Reports Section */}
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginTop: 32, marginBottom: 16 }}>Các báo cáo tùy chuẩn</h3>
      <div style={customReportsGrid}>
        
        {/* Report Card 1 */}
        <div style={reportCardStyle}>
          <div>
            <div style={{ ...iconBoxStyle, backgroundColor: '#fef2f2', color: '#ef4444' }}>
              <i className="bi bi-file-earmark-pdf"></i>
            </div>
            <h4 style={reportTitleStyle}>Báo cáo tình trạng luân chuyển hồ sơ</h4>
            <p style={reportDescStyle}>Xuất danh sách chi tiết các hồ sơ thuế/địa chính đang tồn đọng hoặc đã liên thông thành công giữa 2 cơ quan.</p>
          </div>
          <button style={btnExportStandardStyle}>
            <i className="bi bi-download"></i> Xuất file Excel (.xlsx)
          </button>
        </div>

        {/* Report Card 2 */}
        <div style={reportCardStyle}>
          <div>
            <div style={{ ...iconBoxStyle, backgroundColor: '#eff6ff', color: '#3b82f6' }}>
              <i className="bi bi-people"></i>
            </div>
            <h4 style={reportTitleStyle}>Báo cáo Danh sách Đối tượng Miễn Giảm thuế</h4>
            <p style={reportDescStyle}>Trích xuất danh sách các cá nhân đang hưởng chính sách miễn/giảm thuế (Thương binh, hộ nghèo...) đang lưu trữ trên hệ thống.</p>
          </div>
          <button style={btnExportStandardStyle}>
            <i className="bi bi-download"></i> Xuất file PDF (.pdf)
          </button>
        </div>

      </div>

    </div>
  );
};

// --- STYLES ---

// Top KPIs
const topCardsContainer = { display: 'flex', gap: 24, marginBottom: 24 };
const kpiCardStyle = { 
  flex: 1, 
  backgroundColor: '#fff', 
  padding: '24px', 
  borderRadius: 12, 
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};
const kpiTitleStyle = { fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 0.5, marginBottom: 8 };
const kpiValueStyle = { fontSize: 32, fontWeight: 800, color: '#1e293b', marginBottom: 4 };

// Main Chart
const chartCardStyle = { 
  backgroundColor: '#fff', 
  borderRadius: 12, 
  border: '1px solid #e2e8f0', 
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};
const chartHeaderStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: 24,
  paddingBottom: 20,
  borderBottom: '1px solid #f1f5f9'
};
const btnExportCsvStyle = {
  backgroundColor: '#fef2f2', 
  color: '#dc2626', 
  border: 'none', 
  padding: '8px 16px', 
  borderRadius: 6, 
  fontWeight: 600, 
  fontSize: 13, 
  cursor: 'pointer',
  display: 'flex', 
  alignItems: 'center', 
  gap: 8
};
const chartContainerStyle = { height: 250, width: '100%' };

// Custom Reports
const customReportsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 };
const reportCardStyle = { 
  backgroundColor: '#fff', 
  borderRadius: 12, 
  border: '1px solid #e2e8f0', 
  padding: '24px', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'space-between',
  minHeight: 200
};
const iconBoxStyle = {
  width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 16
};
const reportTitleStyle = { margin: '0 0 8px 0', fontSize: 15, fontWeight: 700, color: '#1e293b' };
const reportDescStyle = { margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 24 };
const btnExportStandardStyle = {
  width: '100%',
  backgroundColor: '#fff', 
  color: '#475569', 
  border: '1px solid #e2e8f0', 
  padding: '12px', 
  borderRadius: 8, 
  fontWeight: 600, 
  fontSize: 14, 
  cursor: 'pointer',
  display: 'flex', 
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  transition: 'background 0.2s'
};

export default AdminReportStats;