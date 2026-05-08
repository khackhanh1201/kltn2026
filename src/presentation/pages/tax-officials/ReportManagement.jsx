import React, { useState } from 'react';
import LandTaxLayout from '../../components/LandTaxLayout';

const ReportManagement = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  const [view, setView] = useState('overview'); // 'overview' | 'create'

  // ================= VIEW: TỔNG QUÁT HỆ THỐNG =================
  if (view === 'overview') {
    return (
      <LandTaxLayout user={user}>
        <div style={containerStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800 }}>Báo cáo tổng quát hệ thống</h2>
              <p style={{ color: '#64748b', marginTop: 4 }}>Kết quả tổng hợp dữ liệu báo cáo thống kê.</p>
            </div>
            <button style={btnPrimary} onClick={() => setView('create')}>
              <i className="bi bi-bar-chart-fill"></i> Tạo báo cáo thống kê
            </button>
          </div>

          {/* Top Metric Card (Donut Chart & Stats) */}
          <div style={topCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
              
              {/* SVG Donut Chart Mockup */}
              <div style={chartContainer}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  {/* Background Circle */}
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                  {/* Red Part (Quá hạn) */}
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="440" strokeDashoffset="380" transform="rotate(-90 90 90)" />
                  {/* Blue Part (Chưa thanh toán) */}
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="440" strokeDashoffset="360" transform="rotate(0 90 90)" />
                  {/* Green Part (Đã thu) */}
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="440" strokeDashoffset="130" transform="rotate(70 90 90)" />
                </svg>
                <div style={chartCenterText}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>TỶ LỆ HOÀN THÀNH</div>
                  <div style={{ fontSize: 24, color: '#3b82f6', fontWeight: 800 }}>78.8%</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={statsGrid}>
                <StatItem dotColor="#1e293b" label="TỔNG PHẢI THU" value="125.000.000 VNĐ" color="#1e293b" />
                <StatItem dotColor="#10b981" label="ĐÃ THU (THỰC THU)" value="98.500.000 VNĐ" color="#10b981" />
                <StatItem dotColor="#3b82f6" label="CHƯA THANH TOÁN" value="15.000.000 VNĐ" color="#3b82f6" />
                <StatItem dotColor="#ef4444" label="QUÁ HẠN" value="11.500.000 VNĐ" color="#ef4444" />
              </div>

            </div>
          </div>

          {/* Charts Grid */}
          <div style={chartsWrapper}>
            {/* Biến động thu theo thời gian (Line Chart) */}
            <div style={chartCardStyle}>
              <h4 style={chartTitle}>Biến động thu theo thời gian</h4>
              <div style={{ height: 200, width: '100%', position: 'relative', marginTop: 20 }}>
                {/* SVG Line Chart Mockup */}
                <svg width="100%" height="100%" preserveAspectRatio="none">
                  <path d="M 0 30 C 100 80, 200 120, 300 80 C 400 40, 500 100, 600 80" fill="none" stroke="#a30d11" strokeWidth="3" />
                  <circle cx="0" cy="30" r="4" fill="#a30d11" />
                  <circle cx="150" cy="78" r="4" fill="#a30d11" />
                  <circle cx="300" cy="80" r="4" fill="#a30d11" />
                  <circle cx="450" cy="50" r="4" fill="#a30d11" />
                  <circle cx="600" cy="80" r="4" fill="#a30d11" />
                </svg>
                {/* Y-Axis */}
                <div style={yAxis}>
                  <span>4000</span><span>3000</span><span>2000</span><span>1000</span><span>0</span>
                </div>
                {/* X-Axis */}
                <div style={xAxis}>
                  <span>Tháng 1</span><span>Tháng 2</span><span>Tháng 3</span><span>Tháng 4</span><span>Tháng 5</span><span>Tháng 6</span>
                </div>
              </div>
            </div>

            {/* So sánh số thu (Bar Chart) */}
            <div style={chartCardStyle}>
              <h4 style={chartTitle}>So sánh số thu giữa các khu vực</h4>
              <div style={{ height: 200, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', position: 'relative', paddingLeft: 40, marginTop: 20 }}>
                {/* Y-Axis */}
                <div style={yAxis}>
                  <span>2000</span><span>1500</span><span>1000</span><span>500</span><span>0</span>
                </div>
                {/* Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: '60%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                  <span style={axisLabel}>Đường A</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: '90%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                  <span style={axisLabel}>Đường B</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: '40%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                  <span style={axisLabel}>Đường C</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: '75%', background: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                  <span style={axisLabel}>Đường D</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Table Placeholder */}
          <div style={{ ...chartCardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
            <h4 style={{ margin: 0 }}>Bảng dữ liệu chi tiết</h4>
            <span style={{ fontSize: 13, color: '#64748b' }}><b>4</b> đối tượng được tìm thấy</span>
          </div>

        </div>
      </LandTaxLayout>
    );
  }

  // ================= VIEW: TẠO BÁO CÁO (FORM) =================
  if (view === 'create') {
    return (
      <LandTaxLayout user={user}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 25 }}>
             <button onClick={() => setView('overview')} style={btnBack}><i className="bi bi-arrow-left"></i></button>
             <div>
                <h2 style={{ margin: 0 }}>Tạo báo cáo thống kê</h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Cấu hình các tiêu chí để hệ thống tổng hợp dữ liệu báo cáo.</p>
             </div>
          </div>

          <div style={formCard}>
            <div style={formGroupFull}>
              <label style={formLabel}>TÊN BÁO CÁO</label>
              <input type="text" placeholder="Nhập tên báo cáo hoặc để trống để tự động sinh..." style={inputStyle} />
            </div>

            <div style={formGrid}>
              <div style={formGroup}>
                <label style={formLabel}>LOẠI BÁO CÁO</label>
                <select style={inputStyle}><option>Tổng hợp</option></select>
              </div>
              <div style={formGroup}>
                <label style={formLabel}>KỲ BÁO CÁO</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="date" style={inputStyle} />
                  <input type="date" style={inputStyle} />
                </div>
              </div>

              <div style={formGroup}>
                <label style={formLabel}>PHẠM VI THỐNG KÊ (PHƯỜNG/XÃ)</label>
                <select style={inputStyle}><option>Tất cả</option></select>
              </div>
              <div style={formGroup}>
                <label style={formLabel}>TUYẾN ĐƯỜNG (NẾU CẦN)</label>
                <select style={inputStyle}><option>Tất cả</option></select>
              </div>
            </div>

            <div style={{ marginTop: 25, marginBottom: 35 }}>
              <label style={formLabel}>ĐỐI TƯỢNG NỘP THUẾ</label>
              <div style={{ display: 'flex', gap: 30, marginTop: 10 }}>
                 <label style={checkboxLabel}><input type="checkbox" defaultChecked style={checkboxInput} /> Cá nhân</label>
                 <label style={checkboxLabel}><input type="checkbox" defaultChecked style={checkboxInput} /> Hộ gia đình</label>
                 <label style={checkboxLabel}><input type="checkbox" defaultChecked style={checkboxInput} /> Tổ chức/Doanh nghiệp</label>
              </div>
            </div>

            <button style={btnPrimary} onClick={() => setView('overview')}>
              <i className="bi bi-bar-chart-fill"></i> Tạo báo cáo
            </button>
          </div>
        </div>
      </LandTaxLayout>
    );
  }
};

// --- Sub-Components ---
const StatItem = ({ dotColor, label, value, color }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }}></div>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{label}</span>
    </div>
    <div style={{ fontSize: 22, fontWeight: 800, color: color }}>{value}</div>
  </div>
);

// --- Styles ---
const containerStyle = { padding: '24px 32px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 };

// Buttons
const btnPrimary = { background: '#a30d11', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };
const btnBack = { width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: 18 };

// Layout
const topCardStyle = { background: '#fff', borderRadius: 24, padding: 40, border: '1px solid #e2e8f0', marginBottom: 20 };
const chartsWrapper = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 };
const chartCardStyle = { background: '#fff', borderRadius: 24, padding: 30, border: '1px solid #e2e8f0' };

// Chart Helpers
const chartContainer = { position: 'relative', width: 180, height: 180 };
const chartCenterText = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const statsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 60px' };
const chartTitle = { margin: 0, fontSize: 15, fontWeight: 700 };
const yAxis = { position: 'absolute', left: 0, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', fontWeight: 600 };
const xAxis = { display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', fontWeight: 600, marginTop: 10 };
const axisLabel = { fontSize: 10, color: '#94a3b8', fontWeight: 600 };

// Form Styles
const formCard = { background: '#fff', borderRadius: 24, padding: 40, border: '1px solid #e2e8f0', maxWidth: 800 };
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 };
const formGroupFull = { marginBottom: 20 };
const formGroup = { display: 'flex', flexDirection: 'column', gap: 8 };
const formLabel = { fontSize: 12, fontWeight: 700, color: '#475569', letterSpacing: 0.5 };
const inputStyle = { width: '100%', padding: '14px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: 14 };

const checkboxLabel = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#1e293b', cursor: 'pointer' };
const checkboxInput = { width: 18, height: 18, accentColor: '#a30d11', cursor: 'pointer' };

export default ReportManagement;