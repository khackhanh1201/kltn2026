import React, { useState } from 'react';
import CadastralLayout from '../../components/CadastralLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';

// Mock Data
const MOCK_PRICES = [
  { id: 'GĐ-001', street: 'Đường Kim Giang', section: 'Từ Cầu Dậu đến ranh giới phường Đại Kim', district: 'Thanh Trì', ward: 'Thanh Liệt', type: 'Đất ở tại đô thị (ODT)', position: 'Vị trí 1', price: '45.000.000', status: 'Đang áp dụng' },
  { id: 'GĐ-002', street: 'Đường Kim Giang', section: 'Từ Cầu Dậu đến ranh giới phường Đại Kim', district: 'Thanh Trì', ward: 'Thanh Liệt', type: 'Đất ở tại đô thị (ODT)', position: 'Vị trí 2', price: '28.000.000', status: 'Đang áp dụng' },
  { id: 'GĐ-003', street: 'Đường Phan Trọng Tuệ', section: 'Từ Cầu Bươu đến ngã ba Ngọc Hồi', district: 'Thanh Trì', ward: 'Thanh Liệt', type: 'Đất cơ sở sản xuất phi nông nghiệp (SKC)', position: 'Vị trí 1', price: '18.000.000', status: 'Đang áp dụng' },
];

const LandPriceManagement = () => {
  const { user } = useUserInfo();
  // const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  
  // States điều hướng
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'create'
  const [showTaxRateModal, setShowTaxRateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // States dữ liệu Thuế suất (Modal)
  const [taxRates, setTaxRates] = useState([
    { id: 1, name: 'Bậc 1 (Trong hạn mức)', rate: '0,03' },
    { id: 2, name: 'Bậc 2 (Vượt hạn mức ≤ 3 lần)', rate: '0,07' },
    { id: 3, name: 'Bậc 3 (Vượt hạn mức > 3 lần)', rate: '0,15' },
  ]);

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
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
              <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Quản lý Giá đất</h2>
              <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Khu vực quản lý: <b>Thanh Liệt, Thanh Trì</b></p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={btnWhiteStyle}><i className="bi bi-download"></i> Xuất Excel</button>
              <button style={btnOrangeStyle} onClick={() => setShowTaxRateModal(true)}>
                <i className="bi bi-percent"></i> Nhập thuế suất
              </button>
              <button style={btnRedStyle} onClick={() => setView('create')}>
                <i className="bi bi-plus"></i> Nhập giá đất
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={filterBarStyle}>
            <div style={searchWrapperStyle}>
              <i className="bi bi-search" style={searchIconStyle}></i>
              <input type="text" placeholder="Tìm kiếm tên đường, đoạn đường..." style={searchInputStyle} />
            </div>
            <div style={selectWrapperStyle}>
              <i className="bi bi-geo-alt" style={selectIconStyle}></i>
              <select style={selectInputStyle}><option>Thanh Trì</option></select>
            </div>
            <div style={selectWrapperStyle}>
              <i className="bi bi-geo-alt" style={selectIconStyle}></i>
              <select style={selectInputStyle}><option>Thanh Liệt</option></select>
            </div>
          </div>

          {/* Table */}
          <div style={tableCardStyle}>
            <table style={tableStyle}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thCellStyle}>TUYẾN ĐƯỜNG / ĐOẠN ĐƯỜNG</th>
                  <th style={thCellStyle}>KHU VỰC</th>
                  <th style={thCellStyle}>LOẠI ĐẤT</th>
                  <th style={thCellStyle}>VỊ TRÍ</th>
                  <th style={{ ...thCellStyle, textAlign: 'right' }}>MỨC GIÁ (VNĐ/M2)</th>
                  <th style={{ ...thCellStyle, textAlign: 'center' }}>TRẠNG THÁI</th>
                  <th style={{ ...thCellStyle, textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PRICES.map((rec, idx) => (
                  <tr key={idx} style={tdRowStyle}>
                    <td style={tdCellStyle}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{rec.street}</div>
                      <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{rec.section}</div>
                    </td>
                    <td style={tdCellStyle}>
                      <div style={{ color: '#1e293b', fontSize: 13 }}>{rec.ward}</div>
                      <div style={{ color: '#94a3b8', fontSize: 12 }}>{rec.district}</div>
                    </td>
                    <td style={{ ...tdCellStyle, color: '#475569', fontSize: 13 }}>{rec.type}</td>
                    <td style={tdCellStyle}>
                      <span style={positionBadgeStyle}>{rec.position}</span>
                    </td>
                    <td style={{ ...tdCellStyle, textAlign: 'right', fontWeight: 800, color: '#dc2626' }}>
                      {rec.price}
                    </td>
                    <td style={{ ...tdCellStyle, textAlign: 'center' }}>
                      <span style={statusBadgeStyle}>{rec.status}</span>
                    </td>
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

          {/* Modal Nhập thuế suất */}
          {showTaxRateModal && (
            <div style={modalOverlayStyle}>
              <div style={modalContentStyle}>
                <div style={modalHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={modalIconBgOrange}><i className="bi bi-percent"></i></div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Thiết lập Thuế suất</h3>
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Quản lý và cập nhật các bậc thuế suất cho đất đai</p>
                    </div>
                  </div>
                  <button onClick={() => setShowTaxRateModal(false)} style={closeBtnDarkStyle}><i className="bi bi-x"></i></button>
                </div>

                <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', marginBottom: 16, textTransform: 'uppercase' }}>CẤU HÌNH CẤP BẬC THUẾ SDĐ PHI NÔNG NGHIỆP</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    {taxRates.map((rate) => (
                      <div key={rate.id} style={taxRateRowStyle}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>CẤP BẬC / MÔ TẢ HẠN MỨC</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{rate.name}</div>
                        </div>
                        <div style={{ width: 100 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>TỶ LỆ (%)</div>
                          <input type="text" defaultValue={rate.rate} style={taxInputStyle} />
                        </div>
                        <button style={btnRemoveRateStyle}><i className="bi bi-x"></i></button>
                      </div>
                    ))}
                  </div>

                  <button style={btnAddRateStyle}>
                    <i className="bi bi-plus"></i> Thêm cấp bậc thuế
                  </button>

                  <div style={{ marginTop: 24 }}>
                    <label style={labelStyle}>Văn bản / Quyết định tham chiếu (Bắt buộc)</label>
                    <input type="text" placeholder="Số hiệu quyết định, Nghị định liên quan..." style={inputBaseStyle} />
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <label style={labelStyle}>Đính kèm Quyết định (Bản scan PDF)</label>
                    <div style={uploadDashBoxStyle}>
                      <i className="bi bi-file-earmark-arrow-up" style={{ fontSize: 24, color: '#94a3b8', marginBottom: 8 }}></i>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>Kéo thả hoặc chạm để tải lên</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Hỗ trợ PDF (Tối đa 10MB)</div>
                    </div>
                  </div>
                </div>

                <div style={modalFooterStyle}>
                  <button style={{ ...btnCancelStyle, flex: 1 }} onClick={() => setShowTaxRateModal(false)}>Hủy bỏ</button>
                  <button style={{ ...btnOrangeStyle, flex: 1, justifyContent: 'center' }} onClick={() => setShowTaxRateModal(false)}>
                    <i className="bi bi-device-hdd"></i> Lưu cập nhật tỷ lệ thuế
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </CadastralLayout>
    );
  }

  // ================= VIEW: CHI TIẾT =================
  if (view === 'detail' && selectedRecord) {
    return (
      <CadastralLayout user={user}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
            <button onClick={() => setView('list')} style={btnBackStyle}><i className="bi bi-arrow-left"></i></button>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Chi tiết Giá đất</h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Mã tham chiếu: {selectedRecord.id}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            {/* Box Thông tin */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 20 }}>
                <i className="bi bi-geo-alt" style={{ color: '#dc2626' }}></i> Thông tin vị trí & Mức giá
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                <InfoData label="TUYẾN ĐƯỜNG" value={selectedRecord.street} />
                <InfoData label="ĐOẠN ĐƯỜNG" value={selectedRecord.section} />
                <InfoData label="QUẬN/HUYỆN" value={selectedRecord.district} />
                <InfoData label="XÃ/PHƯỜNG" value={selectedRecord.ward} />
                <InfoData label="LOẠI ĐẤT" value={selectedRecord.type} />
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, marginBottom: 4 }}>VỊ TRÍ</div>
                  <span style={positionBadgeStyle}>{selectedRecord.position}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40, paddingTop: 20, borderTop: '1px dashed #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, marginBottom: 4 }}>MỨC GIÁ QUY ĐỊNH</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>{selectedRecord.price}</span>
                    <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>VNĐ/m2</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, marginBottom: 4 }}>TRẠNG THÁI</div>
                  <span style={statusBadgeStyle}><i className="bi bi-check-circle"></i> {selectedRecord.status}</span>
                </div>
              </div>
            </div>

            {/* Box Timeline Lịch sử */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 30 }}>
                <i className="bi bi-graph-up-arrow" style={{ color: '#dc2626' }}></i> Lịch sử điều chỉnh giá
              </div>
              
              <div style={{ position: 'relative', paddingLeft: 10 }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', top: 10, bottom: 10, left: 16, width: 2, backgroundColor: '#e2e8f0' }}></div>
                
                {/* Item 1 */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 40, position: 'relative' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#dc2626', border: '3px solid #fff', position: 'relative', zIndex: 2, marginTop: 4 }}></div>
                  <div style={{ backgroundColor: '#fff', border: '1px solid #fecaca', borderRadius: 12, padding: 16, flex: 1, boxShadow: '0 4px 6px rgba(220,38,38,0.05)' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#dc2626' }}>45.000.000</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Áp dụng từ: <br/>01/01/2025</div>
                    <div style={{ backgroundColor: '#f8fafc', padding: 8, borderRadius: 6, fontSize: 10, color: '#475569', marginTop: 10 }}>
                      <i className="bi bi-file-earmark-text"></i> Quyết định số 12/2024/QĐ-UBND
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div style={{ display: 'flex', gap: 20, position: 'relative' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#cbd5e1', border: '3px solid #fff', position: 'relative', zIndex: 2, marginTop: 4 }}></div>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#64748b' }}>38.000.000</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Áp dụng từ: <br/>01/01/2020</div>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: 8, borderRadius: 6, fontSize: 10, color: '#64748b', marginTop: 10 }}>
                      <i className="bi bi-file-earmark-text"></i> Quyết định số 30/2019/QĐ-UBND
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CadastralLayout>
    );
  }

  // ================= VIEW: NHẬP GIÁ ĐẤT QUY ĐỊNH (FORM) =================
  if (view === 'create') {
    return (
      <CadastralLayout user={user}>
        <div style={containerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
            <button onClick={() => setView('list')} style={btnBackStyle}><i className="bi bi-arrow-left"></i></button>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Nhập giá đất quy định</h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Khu vực quản lý: <b>Thanh Liệt, Thanh Trì</b></p>
            </div>
          </div>

          <div style={{ ...cardStyle, maxWidth: 800 }}>
            <div style={{ paddingBottom: 16, borderBottom: '1px solid #f1f5f9', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Thông tin cập nhật giá đất</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Nhập thông tin bảng giá đất mới cho khu vực quản lý</p>
            </div>

            <SectionTitle icon="geo-alt" title="1. THÔNG TIN VỊ TRÍ" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
              <div>
                <label style={labelStyle}>Tuyến đường</label>
                <select style={inputBaseStyle}><option>Chọn tuyến đường</option></select>
              </div>
              <div>
                <label style={labelStyle}>Đoạn đường</label>
                <input type="text" placeholder="Nhập đoạn đường..." style={inputBaseStyle} />
              </div>
              <div>
                <label style={labelStyle}>Xã/Phường</label>
                <input type="text" value="Thanh Liệt" readOnly style={inputDisabledStyle} />
              </div>
              <div>
                <label style={labelStyle}>Quận/Huyện</label>
                <input type="text" value="Thanh Trì" readOnly style={inputDisabledStyle} />
              </div>
            </div>

            <SectionTitle icon="bank" title="2. PHÂN LOẠI & MỨC GIÁ QUY ĐỊNH" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Loại đất mục đích sử dụng</label>
                <select style={inputBaseStyle}><option>Chọn loại đất</option></select>
              </div>
              <div>
                <label style={labelStyle}>Vị trí (theo hẻm/ngõ)</label>
                <select style={inputBaseStyle}><option>Chọn vị trí</option></select>
              </div>
              <div>
                <label style={labelStyle}>Mức giá theo quy định (VNĐ/m2)</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="Ví dụ: 45.000.000" style={{ ...inputBaseStyle, color: '#dc2626', fontWeight: 600 }} />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>VNĐ</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Ngày áp dụng</label>
                <input type="date" style={inputBaseStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Căn cứ / Quyết định tham chiếu</label>
              <input type="text" placeholder="Ví dụ: Căn cứ theo quyết định số 12/2024/QĐ-UBND..." style={inputBaseStyle} />
            </div>

            <div style={{ marginBottom: 30 }}>
              <label style={labelStyle}>File đính kèm Quyết định</label>
              <div style={uploadDashBoxStyle}>
                <i className="bi bi-file-earmark-arrow-up" style={{ fontSize: 24, color: '#94a3b8', marginBottom: 8 }}></i>
                <div style={{ fontWeight: 600, color: '#475569', fontSize: 13 }}>Click để chọn file hoặc kéo thả file vào đây</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Hỗ trợ: PDF, JPG, PNG (Tối đa 10MB)</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button style={btnCancelStyle} onClick={() => setView('list')}>Hủy bỏ</button>
              <button style={{ ...btnRedStyle, padding: '10px 24px' }} onClick={() => setView('list')}>Lưu giá đất</button>
            </div>
          </div>
        </div>
      </CadastralLayout>
    );
  }
};

// --- SUB-COMPONENTS ---
const InfoData = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{value}</div>
  </div>
);

const SectionTitle = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: '#b91c1c', marginBottom: 16 }}>
    <i className={`bi bi-${icon}`}></i> {title}
  </div>
);

// --- STYLES ---
const containerStyle = { padding: '24px 32px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 };

// Buttons
const btnWhiteStyle = { backgroundColor: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8 };
const btnOrangeStyle = { backgroundColor: '#ea580c', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' };
const btnRedStyle = { backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' };
const btnBackStyle = { width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: 16 };
const btnCancelStyle = { padding: '10px 24px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: 13, fontWeight: 700, cursor: 'pointer' };

// Filter Bar
const filterBarStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px', display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 };
const searchWrapperStyle = { position: 'relative', flex: 1 };
const searchIconStyle = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const searchInputStyle = { width: '100%', padding: '10px 16px 10px 42px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' };
const selectWrapperStyle = { position: 'relative', width: 200 };
const selectIconStyle = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 12 };
const selectInputStyle = { width: '100%', padding: '10px 16px 10px 32px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none', backgroundColor: '#f8fafc', color: '#475569', appearance: 'none' };

// Table
const tableCardStyle = { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRowStyle = { borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' };
const thCellStyle = { padding: '16px 20px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' };
const tdRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdCellStyle = { padding: '16px 20px', fontSize: 14 };
const positionBadgeStyle = { backgroundColor: '#fef2f2', color: '#dc2626', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 };
const statusBadgeStyle = { backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: 50, fontSize: 11, fontWeight: 700 };
const iconBtnStyle = { background: '#f8fafc', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', color: '#64748b' };

// Layout Detail/Create
const cardStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 30 };

// Modal Thuế suất
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', width: '100%', maxWidth: 500, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' };
const modalHeaderStyle = { padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9' };
const modalIconBgOrange = { width: 48, height: 48, borderRadius: '50%', backgroundColor: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 };
const closeBtnDarkStyle = { background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' };
const modalFooterStyle = { padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12 };

const taxRateRowStyle = { display: 'flex', gap: 16, alignItems: 'center', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: 12 };
const taxInputStyle = { width: '100%', padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, outline: 'none', color: '#dc2626', fontWeight: 600, textAlign: 'center' };
const btnRemoveRateStyle = { background: 'none', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer', padding: 0 };
const btnAddRateStyle = { width: '100%', padding: '12px', border: '1px dashed #cbd5e1', borderRadius: 12, backgroundColor: '#f8fafc', color: '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: 8 };

// Form Inputs
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 };
const inputBaseStyle = { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none', color: '#1e293b' };
const inputDisabledStyle = { ...inputBaseStyle, backgroundColor: '#f8fafc', color: '#64748b' };
const uploadDashBoxStyle = { border: '1px dashed #cbd5e1', borderRadius: 12, backgroundColor: '#f8fafc', padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' };

export default LandPriceManagement;