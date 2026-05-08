import React, { useState } from 'react';
import LandTaxLayout from '../../components/LandTaxLayout';

// Mock Data
const MOCK_LAND_RECORDS = [
  { gcn: 'CH00124', lot: '102', mapSheet: '15', type: 'Đất ở đô thị', address: '123 Đường Kim Giang, Phường Thanh Liệt, Huyện Thanh Trì, TP. Hà Nội' },
  { gcn: 'CH00045', lot: '45', mapSheet: '8', type: 'Đất thương mại', address: '456 Đường Thanh Liệt, Phường Thanh Liệt, Huyện Thanh Trì, TP. Hà Nội' },
  { gcn: 'CH00102', lot: '78', mapSheet: '12', type: 'Đất ở đô thị', address: '789 Đường Cầu Bươu, Phường Thanh Liệt, Huyện Thanh Trì, TP. Hà Nội' },
];

const LandRegistry = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  
  // Navigation State
  const [view, setView] = useState('list'); // 'list' | 'detail'
  
  // Modal States
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showPushDataModal, setShowPushDataModal] = useState(false);
  const [pushDataMethod, setPushDataMethod] = useState(null); // 'excel' | 'manual' | null
  
  // Filter/Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setView('detail');
  };

  const handleOpenPushData = () => {
    setPushDataMethod(null);
    setShowPushDataModal(true);
  };

  // --- VIEW: DANH SÁCH ---
  if (view === 'list') {
    return (
      <LandTaxLayout user={user}>
        <div style={containerStyle}>
          
          {/* Header */}
          <div style={headerStyle}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Danh sách đất đai</h2>
              <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Quản lý và tra cứu thông tin các thửa đất trên địa bàn</p>
            </div>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={searchWrapperStyle}>
                <i className="bi bi-search" style={searchIconStyle}></i>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm thửa đất số, địa chỉ..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={searchInputStyle}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <button style={btnDarkRedStyle} onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                  <i className="bi bi-sliders"></i> Tìm kiếm nâng cao
                </button>

                {/* Advanced Search Popover */}
                {showAdvancedSearch && (
                  <div style={popoverStyle}>
                    <h4 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Tìm kiếm nâng cao</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <FormInput label="Số vào sổ cấp GCN số" placeholder="Nhập số vào sổ..." />
                      <FormInput label="Thửa đất số" placeholder="Nhập số thửa..." />
                      <FormInput label="Tờ bản đồ số" placeholder="Nhập số tờ bản đồ..." />
                      <div>
                        <label style={labelStyle}>Loại đất</label>
                        <select style={inputBaseStyle}><option>Tất cả</option></select>
                      </div>
                      <FormInput label="Địa chỉ" placeholder="Nhập địa chỉ thửa đất..." />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                      <button style={btnCancelStyle} onClick={() => setShowAdvancedSearch(false)}>Xóa bộ lọc</button>
                      <button style={btnSaveRedStyle} onClick={() => setShowAdvancedSearch(false)}>Đóng</button>
                    </div>
                  </div>
                )}
              </div>

              <button style={btnRedOutlineStyle} onClick={handleOpenPushData}>
                <i className="bi bi-upload"></i> Đẩy dữ liệu
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={tableCardStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thCellStyle}>SỐ VÀO SỔ CẤP GCN SỐ</th>
                  <th style={thCellStyle}>THỬA ĐẤT SỐ</th>
                  <th style={thCellStyle}>TỜ BẢN ĐỒ SỐ</th>
                  <th style={thCellStyle}>LOẠI ĐẤT</th>
                  <th style={thCellStyle}>ĐỊA CHỈ</th>
                  <th style={{ ...thCellStyle, textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LAND_RECORDS.map((rec, idx) => (
                  <tr key={idx} style={tdRowStyle}>
                    <td style={{ ...tdCellStyle, fontWeight: 700, color: '#1e293b' }}>{rec.gcn}</td>
                    <td style={tdCellStyle}>{rec.lot}</td>
                    <td style={tdCellStyle}>{rec.mapSheet}</td>
                    <td style={{ ...tdCellStyle, color: '#64748b' }}>{rec.type}</td>
                    <td style={{ ...tdCellStyle, color: '#64748b' }}>{rec.address}</td>
                    <td style={{ ...tdCellStyle, textAlign: 'center' }}>
                      <button style={iconBtnStyle} onClick={() => handleViewDetail(rec)}>
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODALS CHO ĐẨY DỮ LIỆU --- */}
        {showPushDataModal && (
          <div style={modalOverlayStyle}>
            
            {/* Modal 1: Chọn phương thức */}
            {!pushDataMethod && (
              <div style={{ ...modalContentStyle, maxWidth: 500 }}>
                <div style={modalHeaderBorderedStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <i className="bi bi-upload" style={{ color: '#b91c1c', fontSize: 18 }}></i>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Đẩy dữ liệu đất đai mới</h3>
                  </div>
                  <button onClick={() => setShowPushDataModal(false)} style={closeBtnDarkStyle}><i className="bi bi-x"></i></button>
                </div>
                <div style={{ padding: 24 }}>
                  <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Vui lòng chọn hình thức cập nhật dữ liệu sổ địa chính lên hệ thống.</p>
                  
                  <div style={methodCardStyle} onClick={() => setPushDataMethod('excel')}>
                    <div style={{ ...methodIconBgStyle, backgroundColor: '#ecfdf5', color: '#10b981' }}><i className="bi bi-file-earmark-excel"></i></div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: 15, color: '#1e293b', fontWeight: 800 }}>Đẩy dữ liệu bằng Excel (.xlsx, .csv)</h4>
                      <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>Tải lên danh sách nhiều thửa đất cùng lúc theo biểu mẫu chuẩn của hệ thống.</p>
                    </div>
                  </div>

                  <div style={methodCardStyle} onClick={() => setPushDataMethod('manual')}>
                    <div style={{ ...methodIconBgStyle, backgroundColor: '#eff6ff', color: '#3b82f6' }}><i className="bi bi-keyboard"></i></div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: 15, color: '#1e293b', fontWeight: 800 }}>Nhập dữ liệu thủ công</h4>
                      <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>Điền thông tin chi tiết cho một bản ghi sổ địa chính mới trực tiếp trên hệ thống.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 2.1: Đẩy dữ liệu bằng Excel */}
            {pushDataMethod === 'excel' && (
              <div style={{ ...modalContentStyle, maxWidth: 500, display: 'flex', flexDirection: 'column' }}>
                <div style={modalHeaderBorderedStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => setPushDataMethod(null)} style={backBtnModalStyle}><i className="bi bi-arrow-left"></i></button>
                    <i className="bi bi-upload" style={{ color: '#b91c1c', fontSize: 18 }}></i>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Đẩy dữ liệu đất đai mới</h3>
                  </div>
                  <button onClick={() => setShowPushDataModal(false)} style={closeBtnDarkStyle}><i className="bi bi-x"></i></button>
                </div>

                <div style={{ padding: '40px 24px', textAlign: 'center', flex: 1 }}>
                  <div style={excelIconBigStyle}>
                    <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                  </div>
                  <h4 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Tải lên tệp Excel dữ liệu</h4>
                  <p style={{ margin: '0 auto 30px', fontSize: 14, color: '#64748b', lineHeight: 1.5, maxWidth: 380 }}>
                    Vui lòng tải xuống biểu mẫu chuẩn nếu chưa có, hoặc tải lên tệp dữ liệu đã điền chuẩn cấu trúc.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                    <button style={btnOutlineWideStyle}>
                      <i className="bi bi-download"></i> Tải biểu mẫu chuẩn (.xlsx)
                    </button>
                    <button style={btnRedWideStyle}>
                      <i className="bi bi-upload"></i> Kéo thả hoặc chọn tệp
                    </button>
                  </div>
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <button style={btnCancelStyle} onClick={() => setShowPushDataModal(false)}>Hủy bỏ</button>
                  <button style={{ ...btnSaveRedStyle, width: 'auto', padding: '10px 32px' }}><i className="bi bi-check-circle"></i> Xác nhận đẩy dữ liệu</button>
                </div>
              </div>
            )}

            {/* Modal 2.2: Nhập thủ công */}
            {pushDataMethod === 'manual' && (
              <div style={{ ...modalContentStyle, maxWidth: 600, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <div style={modalHeaderBorderedStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => setPushDataMethod(null)} style={backBtnModalStyle}><i className="bi bi-arrow-left"></i></button>
                    <i className="bi bi-upload" style={{ color: '#b91c1c', fontSize: 18 }}></i>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Đẩy dữ liệu đất đai mới</h3>
                  </div>
                  <button onClick={() => setShowPushDataModal(false)} style={closeBtnDarkStyle}><i className="bi bi-x"></i></button>
                </div>
                
                <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
                  <div style={alertBoxInfoStyle}>
                    <i className="bi bi-info-circle" style={{ fontSize: 18 }}></i>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>Nhập thủ công đầy đủ thông tin Sổ địa chính số để ghi nhận lên hệ thống cơ sở dữ liệu quốc gia.</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <FormInput label="Tên chủ đất" placeholder="Nhập họ và tên chủ sở hữu..." />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <FormInput label="Số CCCD" placeholder="Nhập 12 số CCCD..." />
                      <FormInput label="Số GCN (Sổ đỏ)" placeholder="Ví dụ: CH12345" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <FormInput label="Thửa đất số" placeholder="Số thửa..." />
                      <FormInput label="Tờ bản đồ số" placeholder="Số tờ..." />
                    </div>
                    <FormInput label="Địa chỉ thửa đất" placeholder="Số nhà, đường, phường/xã..." />
                    
                    <div>
                      <label style={labelStyle}>Tệp đính kèm (Sơ đồ, bản vẽ)</label>
                      <div style={uploadDashBoxStyle}>
                        <i className="bi bi-upload" style={{ fontSize: 24, color: '#b91c1c', marginBottom: 12 }}></i>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>Nhấn để tải lên hoặc kéo thả tệp</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>PDF, JPG, PNG (Tối đa 10MB)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', gap: 12 }}>
                  <button style={btnCancelStyle} onClick={() => setShowPushDataModal(false)}>Hủy bỏ</button>
                  <button style={{ ...btnSaveRedStyle, width: 'auto', padding: '10px 32px' }}><i className="bi bi-check-circle"></i> Xác nhận đẩy dữ liệu</button>
                </div>
              </div>
            )}
          </div>
        )}

      </LandTaxLayout>
    );
  }

  // --- VIEW: CHI TIẾT --- (Phần này giữ nguyên logic như bản trước)
  if (view === 'detail' && selectedRecord) {
    // ... Giữ nguyên phần Return của Chi tiết đất đai
    return <div>...</div>; 
  }
};

// --- SUB-COMPONENTS ---
const FormInput = ({ label, placeholder }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input type="text" placeholder={placeholder} style={inputBaseStyle} />
  </div>
);

// --- STYLES (Đã bổ sung cho Modal Excel) ---
const containerStyle = { padding: '24px 32px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 };

const searchWrapperStyle = { position: 'relative', width: 280 };
const searchIconStyle = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const searchInputStyle = { width: '100%', padding: '10px 16px 10px 42px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' };
const btnDarkRedStyle = { backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8 };
const btnRedOutlineStyle = { backgroundColor: '#fff', color: '#b91c1c', border: '1px solid #b91c1c', padding: '10px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8 };

const tableCardStyle = { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRowStyle = { borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' };
const thCellStyle = { padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' };
const tdRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdCellStyle = { padding: '16px 24px', fontSize: 14 };
const iconBtnStyle = { background: '#f8fafc', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', color: '#64748b' };

const popoverStyle = { position: 'absolute', top: '120%', right: 0, width: 320, backgroundColor: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', zIndex: 100 };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 };
const inputBaseStyle = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', color: '#1e293b' };
const btnCancelStyle = { padding: '10px 24px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnSaveRedStyle = { padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: '#b91c1c', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', width: '100%', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' };
const modalHeaderBorderedStyle = { padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' };
const closeBtnDarkStyle = { background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer' };
const backBtnModalStyle = { border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18 };

const methodCardStyle = { border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', gap: 16, cursor: 'pointer', marginBottom: 16, transition: 'border 0.2s' };
const methodIconBgStyle = { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 };
const alertBoxInfoStyle = { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: 16, borderRadius: 8, display: 'flex', gap: 12, marginBottom: 24 };
const uploadDashBoxStyle = { border: '1px dashed #cbd5e1', borderRadius: 8, backgroundColor: '#f8fafc', padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' };

// Excel Modal Specific Styles
const excelIconBigStyle = { width: 72, height: 72, borderRadius: 16, backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px' };
const btnOutlineWideStyle = { width: '80%', padding: '12px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: 8 };
const btnRedWideStyle = { width: '80%', padding: '12px', borderRadius: 8, border: 'none', backgroundColor: '#b91c1c', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: 8 };

export default LandRegistry;