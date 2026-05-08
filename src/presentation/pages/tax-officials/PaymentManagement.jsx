import React, { useState } from 'react';
import LandTaxLayout from '../../components/LandTaxLayout';

const PaymentManagement = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  
  // Trạng thái điều hướng giao diện
  const [view, setView] = useState('list'); // 'list', 'recon_upload', 'recon_result'
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Mock Data Danh sách thanh toán
  const payments = [
    { id: 'HD-2026-001', name: 'Nguyễn Văn An', mst: '0101234567', base: 45000000, penalty: 0, total: 45000000, deadline: '20/05/2026', status: 'ĐANG ĐỐI SOÁT' },
    { id: 'HD-2026-002', name: 'Lê Thị Bình', mst: '0101234568', base: 12500000, penalty: 250000, total: 12750000, deadline: '15/04/2026', status: 'ĐANG ĐỐI SOÁT' },
    { id: 'HD-2026-003', name: 'Trần Văn Cường', mst: '0101234569', base: 8200000, penalty: 0, total: 8200000, deadline: '30/06/2026', status: 'ĐÃ NỘP' },
  ];

  // Render Danh sách chính
  if (view === 'list') {
    return (
      <LandTaxLayout user={user}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800 }}>Quản lý thanh toán</h2>
              <p style={{ color: '#64748b', marginTop: 4 }}>Theo dõi, đối soát và xử lý các giao dịch nộp thuế.</p>
            </div>
            <button style={btnReconStyle} onClick={() => setView('recon_upload')}>
              <i className="bi bi-arrow-repeat"></i> Đối soát thanh toán
            </button>
          </div>

          <div style={cardTableStyle}>
            <div style={filterBar}>
              <div style={tabsWrapper}>
                {['Tất cả', 'Chờ thanh toán', 'Đang đối soát', 'Đã nộp', 'Thất bại'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    style={activeTab === tab ? tabActive : tabInactive}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div style={searchWrapper}>
                <i className="bi bi-search" style={searchIcon}></i>
                <input type="text" placeholder="Tìm theo Mã hóa đơn, MST, Tên người nộp..." style={searchInput} />
              </div>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr style={thRow}>
                  <th>MÃ GIAO DỊCH</th>
                  <th>ĐỐI TƯỢNG (MST)</th>
                  <th style={{ textAlign: 'right' }}>TIỀN GỐC</th>
                  <th style={{ textAlign: 'right' }}>TIỀN PHẠT</th>
                  <th style={{ textAlign: 'right' }}>TỔNG CỘNG</th>
                  <th>NGÀY HẾT HẠN</th>
                  <th>TRẠNG THÁI</th>
                  <th style={{ textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} style={tdRow}>
                    <td style={{ fontWeight: 700 }}>{p.id}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>MST: {p.mst}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>{p.base.toLocaleString()} đ</td>
                    <td style={{ textAlign: 'right', color: p.penalty > 0 ? '#ef4444' : '#64748b' }}>{p.penalty.toLocaleString()} đ</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{p.total.toLocaleString()} đ</td>
                    <td style={{ color: '#64748b' }}>{p.deadline}</td>
                    <td><span style={getStatusBadge(p.status)}>{p.status}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <button style={iconBtn} onClick={() => { setSelectedPayment(p); setShowDetail(true); }}>
                        <i className="bi bi-eye"></i>
                      </button>
                      {p.status === 'ĐÃ NỘP' && <i className="bi bi-file-earmark-text" style={{ color: '#2563eb', marginLeft: 10 }}></i>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showDetail && <PaymentDetailModal payment={selectedPayment} onClose={() => setShowDetail(false)} />}
      </LandTaxLayout>
    );
  }

  // Render Giao diện Upload Đối soát
  if (view === 'recon_upload') {
    return (
      <LandTaxLayout user={user}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 25 }}>
            <button onClick={() => setView('list')} style={btnBack}><i className="bi bi-arrow-left"></i></button>
            <h2 style={{ margin: 0 }}>Đối soát thanh toán</h2>
          </div>
          <div style={cardReconStyle}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h3 style={{ fontWeight: 700 }}>Tải dữ liệu đối soát</h3>
              <p style={{ color: '#64748b' }}>Vui lòng cung cấp file sao kê từ ngân hàng hoặc kho bạc để bắt đầu so khớp.</p>
            </div>
            <div style={{ display: 'flex', gap: 50, justifyContent: 'center' }}>
              <div style={{ width: 350 }}>
                <div style={formGroup}>
                  <label>Chọn tài khoản đối soát</label>
                  <select style={inputStyle}><option>Vietcombank</option></select>
                </div>
                <div style={formGroup}>
                  <label>Chọn kỳ đối soát</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input type="date" style={inputStyle} />
                    <input type="date" style={inputStyle} />
                  </div>
                </div>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>* Hệ thống sẽ giới hạn dữ liệu nợ thuế trong khoảng thời gian này để so sánh.</p>
              </div>
              <div style={uploadBox}>
                <i className="bi bi-upload" style={{ fontSize: 32, color: '#ef4444' }}></i>
                <p style={{ fontWeight: 700, marginTop: 15 }}>Kéo thả file sao kê vào đây</p>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Hỗ trợ .xlsx, .csv (Tối đa 10MB)</p>
                <button style={btnBrowse}>Chọn file từ máy tính</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 50 }}>
              <button style={btnSecondary} onClick={() => setView('list')}>Thoát</button>
              <button style={btnPrimaryDisabled} onClick={() => setView('recon_result')}>Xác nhận <i className="bi bi-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </LandTaxLayout>
    );
  }

  // Render Kết quả đối soát
  if (view === 'recon_result') {
    return (
      <LandTaxLayout user={user}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 25 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <button onClick={() => setView('recon_upload')} style={btnBack}><i className="bi bi-arrow-left"></i></button>
                <h2 style={{ margin: 0 }}>Đối soát thanh toán</h2>
             </div>
             <button style={btnPrimarySmall}><i className="bi bi-upload"></i> Tải dữ liệu đối soát</button>
          </div>
          
          <div style={statsGrid}>
             <StatCard label="TỔNG HỒ SƠ" value="3" color="#f8fafc" />
             <StatCard label="KHỚP HOÀN TOÀN" value="2" color="#f0fdf4" textColor="#16a34a" />
             <StatCard label="SAI LỆCH/NGHI NGỜ" value="1" color="#fef2f2" textColor="#dc2626" />
          </div>

          <div style={cardReconResult}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px' }}>
               <div>
                  <h4 style={{ margin: 0 }}>Kết quả đối soát</h4>
                  <p style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Hệ thống đã tự động so sánh dữ liệu sao kê với cơ sở dữ liệu thuế.</p>
               </div>
               <div style={miniTabs}>
                  <button style={miniTabActive}>Tất cả</button>
                  <button style={miniTab}>Khớp</button>
                  <button style={miniTab}>Lệch</button>
               </div>
            </div>
            
            <table style={reconTable}>
               <thead>
                  <tr>
                    <th>STT</th>
                    <th>THÔNG TIN NGÂN HÀNG (SAO KÊ)</th>
                    <th>THÔNG TIN HỆ THỐNG (DATABASE)</th>
                    <th>TRẠNG THÁI ĐỐI SOÁT</th>
                    <th>HÀNH ĐỘNG</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                    <td>1</td>
                    <td style={{ color: '#94a3b8', fontStyle: 'italic' }}>(Không tìm thấy dữ liệu ngân hàng)</td>
                    <td>
                        <div style={{ fontWeight: 700 }}>MST: 0101234568</div>
                        <div style={{ color: '#2563eb', fontWeight: 700 }}>12.750.000 đ</div>
                        <div style={{ fontSize: 11, color: '#ef4444' }}>TRẠNG THÁI: TRỄ HẠN</div>
                    </td>
                    <td><span style={errorBadge}><i className="bi bi-exclamation-triangle"></i> KHÔNG THẤY GIAO DỊCH TỪ NGÂN HÀNG</span></td>
                    <td><button style={btnActionRed}>Xử lý lỗi</button></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                        <div style={{ fontWeight: 700 }}>Mã: HD-2026-001</div>
                        <div style={{ color: '#ef4444', fontWeight: 700 }}>45.000.000 đ</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>"Nguyen Van An nop thue"</div>
                    </td>
                    <td>
                        <div style={{ fontWeight: 700 }}>MST: 0101234567</div>
                        <div style={{ color: '#2563eb', fontWeight: 700 }}>45.000.000 đ</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>TRẠNG THÁI: BÌNH THƯỜNG</div>
                    </td>
                    <td><span style={successBadge}><i className="bi bi-check-circle"></i> KHỚP 100%</span></td>
                    <td><button style={btnActionGreen}>Xác nhận thành công</button></td>
                  </tr>
               </tbody>
            </table>

            <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9' }}>
               <button style={btnSecondary} onClick={() => setView('recon_upload')}><i className="bi bi-arrow-left"></i> Quay lại</button>
               <button style={btnSecondary} onClick={() => setView('list')}>Thoát</button>
            </div>
          </div>
        </div>
      </LandTaxLayout>
    );
  }
};

// --- Sub-Components ---

const PaymentDetailModal = ({ payment, onClose }) => (
  <div style={modalOverlay}>
    <div style={modalContent}>
      <div style={modalHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ margin: 0 }}>Chi tiết hồ sơ thanh toán</h3>
          <span style={idBadge}>{payment.id}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24 }}><i className="bi bi-x"></i></button>
      </div>
      <div style={{ padding: '0 30px' }}><span style={{ color: '#3b82f6', fontSize: 14 }}>● {payment.status}</span></div>
      
      <div style={modalBody}>
        <Section title="THÔNG TIN NGƯỜI NỘP" icon="person">
          <div style={grid3}>
            <Field label="HỌ VÀ TÊN" value={payment.name} />
            <Field label="MÃ SỐ THUẾ" value={payment.mst} />
            <Field label="SỐ CCCD" value="001090123456" />
            <Field label="ĐỐI TƯỢNG MIỄN THUẾ" value="Không" color="#ef4444" />
            <Field label="ĐỊA CHỈ LIÊN HỆ" value="Phường Thanh Liệt, Huyện Thanh Trì, TP. Hà Nội" span={2} />
          </div>
        </Section>

        <Section title="THÔNG TIN TÀI SẢN" icon="geo-alt">
          <div style={grid3}>
            <Field label="LOẠI HỒ SƠ" value="Thuế chuyển nhượng" />
            <Field label="VỊ TRÍ TÀI SẢN" value="Phường Thanh Liệt" />
            <Field label="DIỆN TÍCH" value="120 m²" />
          </div>
        </Section>

        <Section title="THÔNG TIN TÀI CHÍNH" icon="credit-card">
          <div style={financeBox}>
             <div style={financeRow}><span>Thuế chưa miễn giảm</span> <b>45.000.000 đ</b></div>
             <div style={financeRow}><span>Miễn giảm</span> <b style={{ color: '#22c55e' }}>0%</b></div>
             <div style={divider}></div>
             <div style={financeRow}><span>Tiền gốc phải nộp</span> <b>45.000.000 đ</b></div>
             <div style={financeRow}><span>Tiền phạt/Chậm nộp</span> <b style={{ color: '#ef4444' }}>0 đ</b></div>
             
             <div style={totalHighlightBox}>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: 11, color: '#94a3b8' }}>TỔNG CỘNG PHẢI NỘP</div>
                   <div style={{ fontSize: 32, fontWeight: 800 }}>45.000.000 đ</div>
                   <div style={{ fontSize: 11, fontStyle: 'italic', color: '#94a3b8' }}>Bằng chữ: Bốn mươi lăm triệu đồng chẵn</div>
                </div>
             </div>
          </div>
        </Section>
      </div>

      <div style={modalFooter}>
        <button style={btnSecondary} onClick={onClose}>Đóng</button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={btnOutline}><i className="bi bi-download"></i> Xuất dữ liệu</button>
          <button style={btnGray} disabled><i className="bi bi-printer"></i> Xuất biên lai</button>
        </div>
      </div>
    </div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div style={{ marginBottom: 30 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
      <div style={iconBox}><i className={`bi bi-${icon}`}></i></div>
      <span style={{ fontWeight: 800, fontSize: 14 }}>{title}</span>
    </div>
    <div style={sectionCard}>{children}</div>
  </div>
);

const Field = ({ label, value, span = 1, color }) => (
  <div style={{ gridColumn: `span ${span}` }}>
    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
    <div style={{ fontWeight: 700, fontSize: 14, color: color || '#1e293b' }}>{value}</div>
  </div>
);

const StatCard = ({ label, value, color, textColor }) => (
  <div style={{ ...statCard, background: color }}>
    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{label}</div>
    <div style={{ fontSize: 32, fontWeight: 800, color: textColor || '#1e293b' }}>{value}</div>
  </div>
);

// --- Styles ---
const containerStyle = { padding: '24px 32px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 };
const btnReconStyle = { background: '#a30d11', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' };
const cardTableStyle = { background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9', overflow: 'hidden' };
const filterBar = { padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' };
const tabsWrapper = { display: 'flex', gap: 8, background: '#f8fafc', padding: 4, borderRadius: 12 };
const tabActive = { background: '#a30d11', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13 };
const tabInactive = { background: 'none', color: '#64748b', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' };
const searchWrapper = { position: 'relative', width: 350 };
const searchIcon = { position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const searchInput = { width: '100%', padding: '10px 15px 10px 40px', borderRadius: 50, border: '1px solid #e2e8f0', outline: 'none' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRow = { textAlign: 'left', background: '#f8fafc', color: '#94a3b8', fontSize: 11, letterSpacing: '0.5px' };
const tdRow = { borderBottom: '1px solid #f1f5f9', fontSize: 14 };
const iconBtn = { background: '#f8fafc', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer' };

const getStatusBadge = (s) => ({
  padding: '4px 12px', borderRadius: 50, fontSize: 10, fontWeight: 800,
  background: s === 'ĐÃ NỘP' ? '#dcfce7' : '#dbeafe',
  color: s === 'ĐÃ NỘP' ? '#166534' : '#1e40af'
});

const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { background: '#fff', width: 700, borderRadius: 32, overflow: 'hidden', position: 'relative' };
const modalHeader = { padding: '30px 30px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const idBadge = { background: '#fef2f2', color: '#ef4444', padding: '2px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700 };
const modalBody = { padding: 30, maxHeight: '70vh', overflowY: 'auto' };
const sectionCard = { background: '#f8fafc', borderRadius: 20, padding: 20, border: '1px solid #f1f5f9' };
const iconBox = { width: 32, height: 32, background: '#f0fdf4', color: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 8 };
const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px 15px' };
const financeBox = { background: '#1e293b', color: '#fff', padding: 30, borderRadius: 32 };
const financeRow = { display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 };
const divider = { height: 1, background: 'rgba(255,255,255,0.1)', margin: '15px 0' };
const totalHighlightBox = { marginTop: 25, display: 'flex', justifyContent: 'flex-end' };
const modalFooter = { padding: '20px 30px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' };
const btnOutline = { border: '1px solid #1e293b', background: '#fff', padding: '10px 20px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' };
const btnGray = { background: '#94a3b8', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 700 };
const btnSecondary = { background: '#fff', border: '1px solid #e2e8f0', padding: '10px 25px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' };

const cardReconStyle = { background: '#fff', borderRadius: 32, padding: 60, border: '1px solid #f1f5f9' };
const uploadBox = { border: '2px dashed #e2e8f0', width: 400, borderRadius: 24, padding: 40, textAlign: 'center' };
const btnBrowse = { background: '#1e293b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, marginTop: 15, fontWeight: 700 };
const inputStyle = { width: '100%', padding: '12px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' };
const formGroup = { marginBottom: 20 };
const btnPrimaryDisabled = { background: '#fca5a5', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: 12, fontWeight: 700 };
const btnBack = { width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#f8fafc', cursor: 'pointer' };

const statsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 25 };
const statCard = { padding: 30, borderRadius: 24, textAlign: 'center', border: '1px solid #f1f5f9' };
const cardReconResult = { background: '#fff', borderRadius: 32, border: '1px solid #f1f5f9' };
const miniTabs = { display: 'flex', gap: 5, background: '#f8fafc', padding: 4, borderRadius: 10 };
const miniTab = { background: 'none', border: 'none', padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#64748b' };
const miniTabActive = { ...miniTab, background: '#ef4444', color: '#fff', borderRadius: 8 };
const reconTable = { width: '100%', borderCollapse: 'collapse', borderTop: '1px solid #f1f5f9' };
const btnActionRed = { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: 8, fontWeight: 700, fontSize: 12 };
const btnActionGreen = { background: '#22c55e', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: 8, fontWeight: 700, fontSize: 12 };
const successBadge = { background: '#f0fdf4', color: '#16a34a', padding: '8px 15px', borderRadius: 8, fontSize: 12, fontWeight: 700, width: '100%', display: 'block' };
const errorBadge = { background: '#fef2f2', color: '#dc2626', padding: '8px 15px', borderRadius: 8, fontSize: 12, fontWeight: 700, width: '100%', display: 'block' };
const btnPrimarySmall = { background: '#a30d11', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: 8, fontWeight: 700, fontSize: 13 };

export default PaymentManagement;