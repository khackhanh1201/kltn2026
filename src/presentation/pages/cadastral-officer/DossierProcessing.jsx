import React, { useState } from 'react';
import CadastralLayout from '../../components/CadastralLayout';

// --- MOCK DATA ---
const MOCK_DOSSIERS = [
  { id: 'HS-2026-004', name: 'Trần Minh Tâm', type: 'Đất ở tại đô thị', priority: '-', date: '23/03/2026', status: 'THÀNH CÔNG' },
  { id: 'HS-2026-005', name: 'Hoàng Thị Lan', type: 'Đất thương mại dịch vụ', priority: '-', date: '24/03/2026', status: 'TỪ CHỐI', warning: true },
  { id: 'HS-2026-006', name: 'Đặng Văn Nam', type: 'Đất ở tại đô thị', priority: 'CAO', date: '25/03/2026', status: 'ĐANG XỬ LÝ' },
  { id: 'HS-2026-002', name: 'Lê Thị Bình', type: 'Đất trồng cây lâu năm', priority: 'TRUNG BÌNH', date: '21/03/2026', status: 'ĐANG XỬ LÝ', warning: true },
  { id: 'HS-2026-003', name: 'Phạm Văn Cường', type: 'Đất ở tại nông thôn', priority: 'THẤP', date: '22/03/2026', status: 'CẦN BỔ SUNG' },
];

const DossierProcessing = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  
  // Navigation States
  const [view, setView] = useState('list'); // 'list' | 'detail'
  
  // UI States
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);

  const handleViewDetail = (dossier) => {
    setSelectedDossier(dossier);
    setView('detail');
  };

  // ================= VIEW: DANH SÁCH =================
  if (view === 'list') {
    return (
      <CadastralLayout user={user}>
        <div style={containerStyle}>
          
          {/* Header */}
          <div style={headerStyle}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Xử lý hồ sơ</h2>
              <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Danh sách hồ sơ đất đai cần xử lý và phê duyệt hồ sơ địa chính</p>
            </div>
            
            <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
              <div style={searchWrapperStyle}>
                <i className="bi bi-search" style={searchIconStyle}></i>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mã hồ sơ, tên chủ đất, số thửa..." 
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
                    <FormInput label="MÃ HỒ SƠ" placeholder="Nhập mã hồ sơ..." />
                    <FormInput label="TÊN NGƯỜI NỘP" placeholder="Tên người nộp..." />
                    <FormInput label="SỐ TỜ/SỐ THỬA" placeholder="Số tờ/Số thửa..." />
                    <div>
                      <label style={labelStyle}>PHÂN LOẠI</label>
                      <select style={inputBaseStyle}><option>Tất cả</option></select>
                    </div>
                    <div>
                      <label style={labelStyle}>TRẠNG THÁI</label>
                      <select style={inputBaseStyle}><option>Tất cả</option></select>
                    </div>
                    <div>
                      <label style={labelStyle}>THỜI GIAN</label>
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
              {['Tất cả', 'Chờ duyệt', 'Đang duyệt', 'Đã duyệt'].map(tab => (
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
                  <th style={thCellStyle}>MÃ HỒ SƠ</th>
                  <th style={thCellStyle}>TÊN NGƯỜI NỘP</th>
                  <th style={thCellStyle}>LOẠI ĐẤT</th>
                  <th style={thCellStyle}>ĐỘ ƯU TIÊN</th>
                  <th style={thCellStyle}>NGÀY NHẬN HỒ SƠ</th>
                  <th style={thCellStyle}>TRẠNG THÁI HIỆN TẠI</th>
                  <th style={{ ...thCellStyle, textAlign: 'center' }}>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DOSSIERS.map((item, idx) => (
                  <tr key={idx} style={tdRowStyle}>
                    <td style={{ ...tdCellStyle, fontWeight: 700, color: '#1e293b' }}>
                      {item.id}
                      {item.warning && <i className="bi bi-exclamation-triangle" style={{ color: '#f59e0b', marginLeft: 8 }}></i>}
                    </td>
                    <td style={{ ...tdCellStyle, fontWeight: 700 }}>{item.name}</td>
                    <td style={{ ...tdCellStyle, color: '#64748b' }}>{item.type}</td>
                    <td style={tdCellStyle}>
                      {item.priority !== '-' ? <span style={getPriorityBadge(item.priority)}>{item.priority}</span> : '-'}
                    </td>
                    <td style={{ ...tdCellStyle, color: '#64748b' }}>{item.date}</td>
                    <td style={tdCellStyle}><span style={getStatusBadge(item.status)}>{item.status}</span></td>
                    <td style={{ ...tdCellStyle, textAlign: 'center' }}>
                      <button style={iconBtnStyle} onClick={() => handleViewDetail(item)}>
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CadastralLayout>
    );
  }

  // ================= VIEW: CHI TIẾT =================
  if (view === 'detail' && selectedDossier) {
    return (
      <CadastralLayout user={user}>
        <div style={containerStyle}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <button onClick={() => setView('list')} style={btnBackStyle}><i className="bi bi-arrow-left"></i></button>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Chi tiết hồ sơ địa chính</h3>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={btnWhiteStyle} onClick={() => setShowPdfPreview(true)}>
                <i className="bi bi-download"></i> Xuất hồ sơ
              </button>
              <button style={btnCancelStyle} onClick={() => setView('list')}>Đóng</button>
              <button style={btnSaveRedStyle}>Tiếp nhận</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: 24 }}>
            {/* Cột trái (Thông tin) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Thông tin chung */}
              <div style={cardStyle}>
                <SectionHeader icon="file-earmark-text" title="Thông tin chung hồ sơ" badge="ƯU TIÊN: CAO" badgeColor="#fee2e2" badgeTextColor="#dc2626" />
                <div style={grid4Col}>
                  <InfoItem label="MÃ HỒ SƠ" value="HS-2026-001" bold />
                  <InfoItem label="NGƯỜI NỘP HỒ SƠ" value="Nguyễn Văn An" bold />
                  <InfoItem label="LOẠI HỒ SƠ" value="Chuyển nhượng quyền sử dụng đất" />
                  <InfoItem label="SỐ CCCD" value="001090123456" />
                  <InfoItem label="NGÀY TIẾP NHẬN" value="20/03/2026" />
                  <InfoItem label="TRẠNG THÁI HIỆN TẠI" value="Chờ duyệt" color="#3b82f6" />
                  <InfoItem label="ĐỐI TƯỢNG MIỄN THUẾ" value="Không có" color="#dc2626" />
                </div>
              </div>

              {/* Thông tin thửa đất */}
              <div style={cardStyle}>
                <SectionHeader icon="geo-alt" title="Thông tin thửa đất khai thuế" />
                <div style={grid3Col}>
                  <InfoItemBox label="THỬA ĐẤT SỐ" value="45" />
                  <InfoItemBox label="TỜ BẢN ĐỒ SỐ" value="12" />
                  <InfoItemBox label="DIỆN TÍCH" value="120m2" />
                  <InfoItemBox label="LOẠI ĐẤT" value="Đất ở tại đô thị" />
                  <InfoItemBox label="HÌNH THỨC SỬ DỤNG" value="Sử dụng riêng" />
                </div>
                <div style={{ marginTop: 20 }}>
                  <InfoItemBox label="ĐỊA CHỈ THỬA ĐẤT" value="Phường Thanh Liệt, Huyện Thanh Trì, TP. Hà Nội" />
                </div>
              </div>

              {/* Thông tin tài chính */}
              <div style={cardStyle}>
                <SectionHeader icon="currency-dollar" title="Thông tin nghĩa vụ tài chính" />
                <div style={grid4Col}>
                  <InfoItemBox label="GIÁ ĐẤT" value="2%" />
                  <InfoItemBox label="GIÁ ĐẤT" value="30,000,000 VNĐ/m2" />
                  <InfoItemBox label="HỆ SỐ ĐIỀU CHỈNH" value="1.2" />
                  <InfoItemBox label="MIỄN GIẢM" value="0 VNĐ" color="#dc2626" />
                </div>
              </div>

              {/* Hồ sơ đính kèm */}
              <div style={cardStyle}>
                <SectionHeader icon="check-square" title="Danh mục hồ sơ đính kèm" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <FileItem name="Hợp đồng chuyển nhượng.pdf" status="HỢP LỆ" />
                  <FileItem name="Giấy chứng nhận QSDĐ.pdf" status="HỢP LỆ" />
                  <FileItem name="Tờ khai thuế TNCN.pdf" status="CẦN KIỂM TRA" warning />
                  <FileItem name="Tờ khai lệ phí trước bạ.pdf" status="HỢP LỆ" />
                </div>
              </div>
            </div>

            {/* Cột phải (Lịch sử) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={cardStyle}>
                <SectionHeader icon="clock-history" title="Lịch sử thay đổi hồ sơ" />
                <div style={{ paddingLeft: 10 }}>
                  <TimelineItem role="NGƯỜI DÂN" roleColor="#a855f7" action="Nộp hồ sơ & Đính kèm tài liệu" time="15/03/2026 09:00" user="Người dân - Nguyễn Văn An" tag="MỚI" />
                  <TimelineItem role="HỆ THỐNG" roleColor="#94a3b8" action="Tự động so sánh dữ liệu & Phát hiện sai lệch" time="15/03/2026 09:05" user="Hệ thống tự động" tag="CẦN KIỂM TRA" />
                  <TimelineItem role="CÁN BỘ ĐỊA CHÍNH" roleColor="#f59e0b" action="Kiểm tra thực địa & Chỉnh sửa thông tin" time="18/03/2026 14:30" user="Cán bộ địa chính - Lê Văn M" tag="ĐÃ KIỂM TRA" />
                  <TimelineItem role="HỆ THỐNG" roleColor="#94a3b8" action="Chuyển hồ sơ sang cơ quan địa chính" time="20/03/2026 08:00" user="Hệ thống tự động" tag="CHỜ DUYỆT" />
                  <TimelineItem role="CÁN BỘ ĐỊA CHÍNH" roleColor="#f59e0b" action="In phiếu tiếp nhận" time="20/03/2026 22:20" user="Cán bộ địa chính - Trần Văn H" tag="CHỜ DUYỆT" />
                  <TimelineItem role="CÁN BỘ ĐỊA CHÍNH" roleColor="#f59e0b" action="Tải file PDF phiếu tiếp nhận" time="20/03/2026 22:25" user="Cán bộ địa chính - Trần Văn H" tag="CHỜ DUYỆT" active />
                </div>
              </div>

              <div style={cardStyle}>
                <SectionHeader icon="arrow-repeat" title="Chi tiết thay đổi" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>DIỆN TÍCH</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>18/03/2026 14:15</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ color: '#ef4444', textDecoration: 'line-through', fontWeight: 700 }}>100m2</span>
                  <i className="bi bi-arrow-right" style={{ color: '#94a3b8' }}></i>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>120m2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MODAL PDF PREVIEW --- */}
        {showPdfPreview && (
          <div style={modalOverlayStyle}>
            <div style={{ ...modalContentStyle, width: 800, height: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>
              
              <div style={{ ...modalHeaderBorderedStyle, backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className="bi bi-file-earmark-pdf" style={{ color: '#dc2626', fontSize: 20 }}></i>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Xem trước phiếu tiếp nhận</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 8, backgroundColor: '#fff' }}>
                    <button style={{ border: 'none', background: 'none', padding: '6px 12px', cursor: 'pointer' }}><i className="bi bi-dash"></i></button>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>60%</span>
                    <button style={{ border: 'none', background: 'none', padding: '6px 12px', cursor: 'pointer' }}><i className="bi bi-plus"></i></button>
                  </div>
                  <button onClick={() => setShowPdfPreview(false)} style={closeBtnDarkStyle}><i className="bi bi-x"></i></button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 40, display: 'flex', justifyContent: 'center' }}>
                {/* Giấy A4 */}
                <div style={{ width: 600, minHeight: 800, backgroundColor: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '50px 60px', fontFamily: '"Times New Roman", Times, serif' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginBottom: 40 }}>
                    <div>
                      <div style={{ fontSize: 13 }}>SỞ TÀI NGUYÊN VÀ MÔI TRƯỜNG</div>
                      <div style={{ fontSize: 14, fontWeight: 'bold' }}>VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI</div>
                      <div style={{ width: 80, height: 1, backgroundColor: '#000', margin: '4px auto 0' }}></div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 'bold' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div style={{ fontSize: 14, fontWeight: 'bold' }}>Độc lập - Tự do - Hạnh phúc</div>
                      <div style={{ width: 120, height: 1, backgroundColor: '#000', margin: '4px auto 0' }}></div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 'bold' }}>PHIẾU TIẾP NHẬN HỒ SƠ</h2>
                    <div style={{ fontSize: 13, fontStyle: 'italic' }}>Số: HS-2026-001/PTN-VPĐKĐĐ</div>
                  </div>

                  <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                    <div><b>1. Thông tin người nộp:</b> Nguyễn Văn An</div>
                    <div><b>2. Số CCCD/Số tờ/Số thửa:</b> 001090123456</div>
                    <div><b>3. Đối tượng miễn thuế:</b> Không có</div>
                    <div><b>4. Loại hồ sơ:</b> Chuyển nhượng quyền sử dụng đất</div>
                    <div><b>5. Thông tin thửa đất:</b></div>
                    <div style={{ paddingLeft: 20 }}>
                      - Thửa đất số: 45; Tờ bản đồ số: 12<br/>
                      - Diện tích: 120m2<br/>
                      - Loại đất: Đất ở tại đô thị<br/>
                      - Hình thức sử dụng: Sử dụng riêng<br/>
                      - Địa chỉ: Phường Thanh Liệt, Huyện Thanh Trì, TP. Hà Nội
                    </div>
                    <div style={{ marginTop: 8 }}><b>6. Danh mục tài liệu đính kèm:</b></div>
                    <div style={{ paddingLeft: 20 }}>
                      1. Hợp đồng chuyển nhượng.pdf<br/>
                      2. Giấy chứng nhận QSDĐ.pdf<br/>
                      3. Tờ khai thuế TNCN.pdf<br/>
                      4. Tờ khai lệ phí trước bạ.pdf
                    </div>
                    <div style={{ marginTop: 8 }}><b>7. Ngày tiếp nhận:</b> 20/03/2026</div>
                    <div style={{ marginTop: 8 }}><b>8. Trạng thái:</b> <span style={{ color: '#2563eb', fontWeight: 'bold' }}>Chờ duyệt</span></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50, textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 14 }}>NGƯỜI NỘP HỒ SƠ</div>
                    <div>
                      <div style={{ fontStyle: 'italic', fontSize: 14, marginBottom: 4 }}>Hà Nội, ngày 4 tháng 5 năm 2026</div>
                      <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 80 }}>CÁN BỘ TIẾP NHẬN</div>
                      <div style={{ fontWeight: 'bold', fontSize: 14 }}>Trần Văn H</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px 24px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button style={btnCancelStyle} onClick={() => setShowPdfPreview(false)}>Hủy bỏ</button>
                <button style={btnBlueStyle}><i className="bi bi-download"></i> Tải file PDF</button>
                <button style={btnSaveRedStyle}><i className="bi bi-printer"></i> In phiếu trực tiếp</button>
              </div>
            </div>
          </div>
        )}

      </CadastralLayout>
    );
  }
};

// --- SUB-COMPONENTS ---
const FormInput = ({ label, placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={labelStyle}>{label}</label>
    <input type="text" placeholder={placeholder} style={inputBaseStyle} />
  </div>
);

const SectionHeader = ({ icon, title, badge, badgeColor, badgeTextColor }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: '#b91c1c' }}>
      <i className={`bi bi-${icon}`}></i> {title}
    </div>
    {badge && <span style={{ backgroundColor: badgeColor, color: badgeTextColor, padding: '4px 10px', borderRadius: 50, fontSize: 10, fontWeight: 800 }}>{badge}</span>}
  </div>
);

const InfoItem = ({ label, value, bold, color }) => (
  <div>
    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: bold ? 800 : 600, color: color || '#1e293b' }}>{value}</div>
  </div>
);

const InfoItemBox = ({ label, value, color }) => (
  <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: 8 }}>
    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 700, color: color || '#1e293b' }}>{value}</div>
  </div>
);

const FileItem = ({ name, status, warning }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <i className="bi bi-check-circle-fill" style={{ color: warning ? '#f59e0b' : '#10b981' }}></i>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{name}</div>
        <div style={{ fontSize: 10, fontWeight: 800, color: warning ? '#f59e0b' : '#10b981', marginTop: 2 }}>{status}</div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 12, color: '#94a3b8' }}>
      <i className="bi bi-eye" style={{ cursor: 'pointer' }}></i>
      <i className="bi bi-download" style={{ cursor: 'pointer' }}></i>
    </div>
  </div>
);

const TimelineItem = ({ role, roleColor, action, time, user, tag, active }) => (
  <div style={{ display: 'flex', gap: 16, position: 'relative', paddingBottom: 24 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: active ? '#2563eb' : '#e2e8f0', zIndex: 2 }}></div>
      <div style={{ width: 2, flex: 1, backgroundColor: '#f1f5f9' }}></div>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: '#fff', backgroundColor: roleColor, padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 4 }}>{role}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: active ? '#1e293b' : '#475569' }}>{action}</div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{time}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Thực hiện bởi: {user}</div>
      <div style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: 50, fontSize: 9, fontWeight: 800, display: 'inline-block', marginTop: 8, color: '#64748b' }}>{tag}</div>
    </div>
  </div>
);

// --- STYLES ---

const containerStyle = { padding: '24px 32px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 };

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
const thCellStyle = { padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' };
const tdRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdCellStyle = { padding: '16px 24px', fontSize: 14 };
const iconBtnStyle = { background: '#f8fafc', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', color: '#64748b' };

// Badges
const getPriorityBadge = (p) => {
  const base = { padding: '4px 10px', borderRadius: 50, fontSize: 10, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 };
  if (p === 'CAO') return { ...base, backgroundColor: '#fee2e2', color: '#dc2626' };
  if (p === 'TRUNG BÌNH') return { ...base, backgroundColor: '#fef3c7', color: '#d97706' };
  if (p === 'THẤP') return { ...base, backgroundColor: '#dbeafe', color: '#2563eb' };
  return base;
};

const getStatusBadge = (s) => {
  const base = { padding: '6px 12px', borderRadius: 50, fontSize: 11, fontWeight: 800 };
  if (s === 'THÀNH CÔNG') return { ...base, backgroundColor: '#dcfce7', color: '#16a34a' };
  if (s === 'TỪ CHỐI') return { ...base, backgroundColor: '#fee2e2', color: '#dc2626' };
  if (s === 'ĐANG XỬ LÝ') return { ...base, backgroundColor: '#dbeafe', color: '#2563eb' };
  if (s === 'CẦN BỔ SUNG') return { ...base, backgroundColor: '#fef3c7', color: '#d97706' };
  return base;
};

// Popover
const popoverStyle = { position: 'absolute', top: '120%', right: 0, width: 400, backgroundColor: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid #f1f5f9', zIndex: 100 };
const filterGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 800, color: '#94a3b8', marginBottom: 6 };
const inputBaseStyle = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' };
const btnCancelStyle = { flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnSaveRedStyle = { flex: 1, padding: '10px', borderRadius: 8, border: 'none', backgroundColor: '#b91c1c', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' };

// Detail Layout
const btnBackStyle = { width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: 16 };
const btnWhiteStyle = { backgroundColor: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' };
const cardStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 };
const grid4Col = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 };
const grid3Col = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 };

// Modal PDF
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const modalHeaderBorderedStyle = { padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' };
const closeBtnDarkStyle = { background: 'none', border: 'none', color: '#64748b', fontSize: 24, cursor: 'pointer' };
const btnBlueStyle = { padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', gap: 8 };

export default DossierProcessing;