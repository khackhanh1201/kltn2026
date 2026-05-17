import React, { useState, useEffect } from 'react';
import TaxOfficerLayout from '../../components/TaxOfficerLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';// Giả sử bạn dùng react-router-dom để điều hướng
// import { useNavigate } from 'react-router-dom'; 

const MOCK_DATA = [
  { id: 'HS-2026-001', name: 'Nguyễn Văn An', landType: 'Đất ở tại đô thị', priority: 'CAO', date: '20/03/2026', status: 'CHỜ DUYỆT', mainTab: 'PENDING', risk: 'normal' },
  { id: 'HS-2026-006', name: 'Đặng Văn Nam', landType: 'Đất ở tại đô thị', priority: 'CAO', date: '25/03/2026', status: 'ĐANG XỬ LÝ', mainTab: 'PROCESSING', risk: 'normal' },
  { id: 'HS-2026-003', name: 'Phạm Văn Cường', landType: 'Đất ở tại nông thôn', priority: 'THẤP', date: '22/03/2026', status: 'CẦN BỔ SUNG', mainTab: 'PROCESSING', risk: 'normal' },
  { id: 'HS-2026-002', name: 'Lê Thị Bình', landType: 'Đất trồng cây lâu năm', priority: 'TRUNG BÌNH', date: '21/03/2026', status: 'ĐANG XỬ LÝ', mainTab: 'PROCESSING', risk: 'fraud', warning: true },
  { id: 'HS-2026-005', name: 'Hoàng Thị Lan', landType: 'Đất thương mại dịch vụ', priority: '-', date: '24/03/2026', status: 'TỪ CHỐI', mainTab: 'COMPLETED', risk: 'normal', warning: true },
  { id: 'HS-2026-004', name: 'Trần Minh Tâm', landType: 'Đất ở tại đô thị', priority: '-', date: '23/03/2026', status: 'THÀNH CÔNG', mainTab: 'COMPLETED', risk: 'normal' },
];

const TaxProcessing = () => {
  const { user } = useUserInfo();
 // const navigate = useNavigate(); // Hook điều hướng

  const [activeTab, setActiveTab] = useState('ALL'); 
  const [riskFilter, setRiskFilter] = useState('normal'); 
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    let data = MOCK_DATA;
    if (activeTab !== 'ALL') data = data.filter(item => item.mainTab === activeTab);
    if (activeTab === 'PROCESSING') data = data.filter(item => item.risk === riskFilter);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(item => item.id.toLowerCase().includes(q) || item.name.toLowerCase().includes(q));
    }
    setFilteredData(data);
  }, [activeTab, riskFilter, search]);

  // Hàm xử lý điều hướng sang trang chi tiết
  const goToDetail = (id) => {
    // Nếu dùng React Router:
    // navigate(`/tax/processing/${id}`);
    
    // Nếu dùng window location (tạm thời):
    console.log("Điều hướng tới hồ sơ:", id);
    window.location.href = `/tax/detail/${id}`; // Cập nhật route thực tế của bạn
  };

  return (
    <TaxOfficerLayout user={user}>
      <div style={{ padding: '20px 30px', position: 'relative' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontWeight: 800, margin: 0 }}>Xử lý khai thuế</h3>
            <p style={{ color: '#64748b', margin: '4px 0 0' }}>Danh sách hồ sơ đất đai cần xử lý và phê duyệt nghĩa vụ tài chính</p>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ position: 'relative', width: 400 }}>
              <i className="bi bi-search" style={searchIconStyle} />
              <input 
                type="text" 
                placeholder="Tìm kiếm mã hồ sơ..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={searchInputStyle} 
              />
            </div>
            
            <button 
              style={btnAdvancedSearch}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <i className="bi bi-filter" /> Tìm kiếm nâng cao
            </button>

            {/* Advanced Filter Popover (Ảnh image_ff96f8.png) */}
            {showAdvanced && (
              <div style={filterPopoverStyle}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700 }}>Bộ lọc tìm kiếm</h4>
                <div style={filterGridStyle}>
                  <FilterInput label="MÃ HỒ SƠ" placeholder="Nhập mã hồ sơ..." />
                  <FilterInput label="TÊN NGƯỜI NỘP" placeholder="Tên người nộp..." />
                  <FilterInput label="MÃ SỐ THUẾ" placeholder="Mã số thuế..." />
                  <FilterSelect label="LOẠI THUẾ" options={['Tất cả', 'Thuế đất PNN', 'Lệ phí trước bạ']} />
                  <FilterSelect label="TRẠNG THÁI" options={['Tất cả', 'Chờ duyệt', 'Đang xử lý', 'Thành công']} />
                  <FilterInput label="THỜI GIAN" type="date" />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 25 }}>
                  <button style={btnResetFilter} onClick={() => setShowAdvanced(false)}>Xóa bộ lọc</button>
                  <button style={btnApplyFilter} onClick={() => setShowAdvanced(false)}>Áp dụng</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div style={tableContainerStyle}>
          {/* Status Tabs */}
          <div style={tabsWrapperStyle}>
            {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={tab === activeTab ? tabActiveStyle : tabInactiveStyle}
              >
                {tab === 'ALL' && 'Tất cả'}
                {tab === 'PENDING' && 'Chờ duyệt'}
                {tab === 'PROCESSING' && 'Đang duyệt'}
                {tab === 'COMPLETED' && 'Đã duyệt'}
              </button>
            ))}
          </div>

          {/* Risk Filtering (Cho tab PROCESSING) */}
          {activeTab === 'PROCESSING' && (
            <div style={riskBarWrapperStyle}>
              <button onClick={() => setRiskFilter('normal')} style={riskFilter === 'normal' ? riskBtnNormalActive : riskBtnBase}>Bình thường</button>
              <button onClick={() => setRiskFilter('fraud')} style={riskFilter === 'fraud' ? riskBtnFraudActive : riskBtnBase}>
                <i className="bi bi-exclamation-triangle" style={{ marginRight: 6 }} /> Gian lận
              </button>
              <span style={riskNoteStyle}>HỒ SƠ RỦI RO THẤP</span>
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={thStyle}>Mã hồ sơ</th>
                <th style={thStyle}>Tên người nộp</th>
                <th style={thStyle}>Loại đất</th>
                <th style={thStyle}>Độ ưu tiên</th>
                <th style={thStyle}>Ngày nhận hồ sơ</th>
                <th style={thStyle}>Trạng thái hiện tại</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} style={tableBodyRowStyle}>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 700 }}>{item.id}</span>
                    {item.warning && <i className="bi bi-exclamation-triangle-fill" style={{ color: '#f59e0b', marginLeft: 8 }} />}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{item.name}</td>
                  <td style={{ ...tdStyle, color: '#64748b' }}>{item.landType}</td>
                  <td style={tdStyle}>
                    {item.priority !== '-' ? (
                      <span style={getPriorityBadge(item.priority)}>
                         {item.priority}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ ...tdStyle, color: '#64748b' }}>{item.date}</td>
                  <td style={tdStyle}>
                    <span style={getStatusBadge(item.status)}>{item.status}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      {/* Cập nhật sự kiện click cho nút Tiếp nhận và Xem chi tiết */}
                      {item.mainTab === 'PENDING' && (
                        <button style={btnActionPrimary} onClick={() => goToDetail(item.id)}>
                          Tiếp nhận hồ sơ
                        </button>
                      )}
                      <button style={btnActionIcon} onClick={() => goToDetail(item.id)}>
                        <i className="bi bi-eye" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TaxOfficerLayout>
  );
};

// --- Sub-components & Styles ---
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

const filterInputBaseStyle = { padding: '12px', borderRadius: 12, border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: 14, outline: 'none' };
const filterPopoverStyle = { position: 'absolute', top: '110%', right: 0, width: 500, background: '#fff', borderRadius: 24, padding: 30, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', zIndex: 1000, border: '1px solid #f1f5f9' };
const filterGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px' };
const btnResetFilter = { flex: 1, padding: '14px', border: 'none', borderRadius: 12, background: '#f1f5f9', fontWeight: 700, cursor: 'pointer' };
const btnApplyFilter = { flex: 1, padding: '14px', border: 'none', borderRadius: 12, background: '#a30d11', color: '#fff', fontWeight: 700, cursor: 'pointer' };

const searchInputStyle = { width: '100%', padding: '12px 14px 12px 45px', border: '1px solid #e2e8f0', borderRadius: 12, outline: 'none' };
const searchIconStyle = { position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const btnAdvancedSearch = { padding: '10px 20px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };
const tableContainerStyle = { background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', overflow: 'hidden' };
const tabsWrapperStyle = { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 8 };
const tabInactiveStyle = { padding: '8px 24px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#94a3b8', background: 'transparent' };
const tabActiveStyle = { ...tabInactiveStyle, background: '#f1f5f9', color: '#1e293b' };
const riskBarWrapperStyle = { padding: '12px 24px', display: 'flex', gap: 12, background: '#f8fafc' };
const riskBtnBase = { padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' };
const riskBtnNormalActive = { ...riskBtnBase, background: '#0f172a', color: '#fff' };
const riskBtnFraudActive = { ...riskBtnBase, background: '#a30d11', color: '#fff' };
const riskNoteStyle = { alignSelf: 'center', fontSize: 12, color: '#94a3b8', fontWeight: 600 };
const thStyle = { padding: '20px 24px' };
const tdStyle = { padding: '20px 24px', fontSize: 14 };
const tableHeaderRowStyle = { textAlign: 'left', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' };
const tableBodyRowStyle = { borderBottom: '1px solid #f8fafc' };
const btnActionPrimary = { padding: '8px 16px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' };
const btnActionIcon = { background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: 8, color: '#64748b', cursor: 'pointer' };

const getPriorityBadge = (p) => ({
  display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800,
  background: p === 'CAO' ? '#fee2e2' : p === 'TRUNG BÌNH' ? '#ffedd5' : '#e0e7ff',
  color: p === 'CAO' ? '#ef4444' : p === 'TRUNG BÌNH' ? '#f59e0b' : '#6366f1',
});

const getStatusBadge = (status) => {
  const base = { padding: '6px 12px', borderRadius: 50, fontSize: 11, fontWeight: 800 };
  if (status === 'CHỜ DUYỆT') return { ...base, background: '#f1f5f9', color: '#64748b' };
  if (status === 'ĐANG XỬ LÝ') return { ...base, background: '#dbeafe', color: '#3b82f6' };
  if (status === 'THÀNH CÔNG') return { ...base, background: '#dcfce7', color: '#22c55e' };
  return base;
};

export default TaxProcessing;