import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';

const API_BASE = 'http://localhost:8080/api';

const STEPS = [
  { id: 1, label: 'XÁC THỰC' },
  { id: 2, label: 'THÔNG TIN' },
  { id: 3, label: 'TÀI LIỆU' },
  { id: 4, label: 'GỬI HỒ SƠ' },
];

const DECLARATION_TYPES = [
  'Đăng ký biến động đất đai',
  'Cấp đổi giấy chứng nhận',
  'Khai thuế chuyển nhượng',
  'Tách/Hợp thửa đất',
  'Khai báo đất sở hữu (Đất mới)',
];

const SubmitDeclarationPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useUserInfo();

  // ==========================================
  // 1. TẤT CẢ HOOKS PHẢI NẰM Ở ĐÂY (TRÊN CÙNG)
  // ==========================================
  const [step, setStep] = useState(1);
  const [landPlots, setLandPlots] = useState([]);
  const [loadingPlots, setLoadingPlots] = useState(false);
  
  const [form, setForm] = useState({
    recordCategory: DECLARATION_TYPES[0], 
    landParcelId: '',                     
    notes: '',                            
  });

  const [files, setFiles] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [declarationCode, setDeclarationCode] = useState('');

  // Xử lý logic lấy CCCD (Biến JS bình thường, không phải Hook)
  const token = localStorage.getItem('token') || '';
  let cccdNumberFromToken = '';
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      cccdNumberFromToken = payload?.cccdNumber || payload?.sub || '';
    }
  } catch (e) {}
  
  const cccdNumber = cccdNumberFromToken || user?.cccdNumber || 'Chưa xác định';

  // useEffect cũng phải khai báo trước return
  useEffect(() => {
    // Chỉ fetch khi có cccdNumber hợp lệ
    if (step === 2 && cccdNumber !== 'Chưa xác định' && landPlots.length === 0) {
      setLoadingPlots(true);
      fetch(`${API_BASE}/land-parcels/my-parcels`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const list = Array.isArray(data) ? data : (data?.data || []);
          const mappedPlots = list.map(p => ({
            landParcelId: p.land_parcel_id || p.landParcelId || p.id,
            parcelNumber: p.parcel_number || p.parcelNumber || p.parcelCode || '—',
            gcnBookNumber: p.gcn_book_number || p.gcnBookNumber || p.certificateNumber || '—',
            address: p.address || 'Không xác định',
            areaSize: p.area_size || p.areaSize || 0
          }));
          setLandPlots(mappedPlots);
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingPlots(false));
    }
  }, [step, cccdNumber, landPlots.length]);

  // ==========================================
  // 2. SAU KHI ĐÃ KHAI BÁO HẾT HOOKS MỚI ĐƯỢC RETURN SỚM
  // ==========================================
  if (loading || !user) {
    return (
      <LandTaxLayout user={user}>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-3">Đang tải thông tin người dùng...</p>
        </div>
      </LandTaxLayout>
    );
  }

  // ==========================================
  // 3. CÁC HÀM XỬ LÝ (FUNCTIONS)
  // ==========================================
  const handleFileSelect = (e) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.landParcelId) {
      setError('Vui lòng chọn thửa đất');
      return;
    }
    if (!agreed) {
      setError('Vui lòng đồng ý với cam kết');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        landParcelId: Number(form.landParcelId),
        recordCategory: form.recordCategory,
        notes: form.notes, 
        attachments: files.map(f => ({
          fileName: f.name,
          fileType: f.type || 'UNKNOWN'
        }))
      };

      const res = await fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Lỗi ${res.status}`);
      }

      const result = await res.json();
      const newId = result.data?.record_id || result.data?.recordId || result.recordId || Date.now();
      setDeclarationCode(`HS-${new Date().getFullYear()}-${String(newId).padStart(4, '0')}`);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Nộp hồ sơ thất bại. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // 4. MAIN RENDER
  // ==========================================
  if (success) {
    return (
      <LandTaxLayout user={user}>
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 460 }}>
            <div style={{ width: 90, height: 90, background: '#dcfce7', borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-check-circle-fill" style={{ fontSize: 55, color: '#16a34a' }} />
            </div>
            <h3 style={{ fontWeight: 800 }}>Nộp hồ sơ thành công!</h3>
            <p style={{ color: '#64748b', margin: '12px 0 32px' }}>
              Mã hồ sơ: <strong className="text-dark fs-5">{declarationCode}</strong>
            </p>
            <button 
              onClick={() => navigate('/property-declaration')}
              style={{ padding: '14px 32px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700 }}
            >
              Theo dõi hồ sơ
            </button>
          </div>
        </div>
      </LandTaxLayout>
    );
  }

  return (
    <LandTaxLayout user={user}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button 
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/property-declaration')} 
            style={{ background: 'none', border: 'none', fontSize: 26, color: '#64748b' }}
          >
            ←
          </button>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800 }}>Tạo hồ sơ mới</h4>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Hoàn thành các bước để gửi hồ sơ</p>
          </div>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: step > s.id ? '#a30d11' : step === s.id ? '#a30d11' : '#e2e8f0',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                }}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <span style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: step >= s.id ? '#a30d11' : '#94a3b8' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 3, background: step > s.id ? '#a30d11' : '#e2e8f0', margin: '18px 20px 0' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '40px 48px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>

          {/* Bước 1: Xác thực */}
          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
              <h5 style={{ fontWeight: 700 }}>Xác thực danh tính</h5>
              <p style={{ color: '#64748b', marginBottom: 32 }}>Hệ thống sẽ sử dụng thông tin định danh mức 2 của bạn</p>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span>Họ và tên</span>
                  <strong>{user?.fullName || 'Nguyễn Công Việt'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span>Số định danh (CCCD)</span>
                  <strong>{cccdNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                  <span>Mức độ định danh</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Mức 2 (Đã xác thực)</span>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)} 
                style={{ marginTop: 40, width: '100%', padding: '16px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700 }}
              >
                Tiếp tục
              </button>
            </div>
          )}

          {/* Bước 2: Thông tin hồ sơ */}
          {step === 2 && (
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Thông tin hồ sơ</h5>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Loại hồ sơ (Mục đích khai báo)</label>
                <select
                  value={form.recordCategory}
                  onChange={(e) => setForm({ ...form, recordCategory: e.target.value })}
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0' }}
                >
                  {DECLARATION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Chọn thửa đất liên quan <span style={{color:'red'}}>*</span></label>
                {loadingPlots ? (
                  <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: 10, color: '#94a3b8' }}>
                    <span className="spinner-border spinner-border-sm me-2 text-danger"></span> Đang tải danh sách thửa đất...
                  </div>
                ) : (
                  <select
                    value={form.landParcelId}
                    onChange={(e) => setForm({ ...form, landParcelId: e.target.value })}
                    style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0' }}
                  >
                    <option value="">-- Chọn Số vào sổ cấp GCN / Thửa đất --</option>
                    {landPlots.map(p => (
                      <option key={p.landParcelId} value={p.landParcelId}>
                        Sổ: {p.gcnBookNumber} - Thửa: {p.parcelNumber} ({p.address})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Nội dung chi tiết (Tùy chọn)</label>
                <textarea
                  rows="4"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Mô tả chi tiết nội dung hoặc ghi chú bổ sung..."
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>Quay lại</button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!form.landParcelId}
                  style={{ flex: 1, padding: '14px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700 }}
                >
                  Tiếp tục →
                </button>
              </div>
            </div>
          )}

          {/* Bước 3: Tài liệu đính kèm */}
          {step === 3 && (
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 8 }}>Tài liệu đính kèm</h5>
              <p style={{ color: '#64748b', marginBottom: 24 }}>Tải lên các giấy tờ liên quan (GCNQSDĐ, CMND/CCCD, Hợp đồng...)</p>

              <div 
                style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: '60px 20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}
                onClick={() => document.getElementById('fileUpload').click()}
              >
                <i className="bi bi-cloud-arrow-up" style={{ fontSize: 48, color: '#a30d11' }}></i>
                <p style={{ marginTop: 12, fontWeight: 600, color: '#1e293b' }}>Nhấn để tải lên tài liệu</p>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Hoặc kéo thả file vào khu vực này</p>
                <div style={{ marginTop: 16 }}>
                  <span style={{ background: '#e2e8f0', padding: '4px 12px', borderRadius: 20, fontSize: 12, marginRight: 6, color: '#475569' }}>PDF</span>
                  <span style={{ background: '#e2e8f0', padding: '4px 12px', borderRadius: 20, fontSize: 12, marginRight: 6, color: '#475569' }}>JPG/PNG</span>
                  <span style={{ background: '#e2e8f0', padding: '4px 12px', borderRadius: 20, fontSize: 12, color: '#475569' }}>Tối đa 20MB</span>
                </div>
              </div>
              <input type="file" id="fileUpload" multiple className="d-none" onChange={handleFileSelect} />

              {files.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <strong className="text-secondary small">DANH SÁCH ĐÃ TẢI LÊN ({files.length})</strong>
                  <ul style={{ marginTop: 8, padding: 0, listStyle: 'none' }}>
                    {files.map((file, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 8, background: '#fff' }}>
                        <div className="d-flex align-items-center gap-2 text-dark fw-medium">
                          <i className="bi bi-file-earmark-text text-primary"></i> {file.name}
                        </div>
                        <button onClick={() => removeFile(index)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 600 }}>Xóa</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>Quay lại</button>
                <button onClick={() => setStep(4)} style={{ flex: 1, padding: '14px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700 }}>Tiếp tục →</button>
              </div>
            </div>
          )}

          {/* Bước 4: Kiểm tra & Gửi */}
          {step === 4 && (
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Kiểm tra & Gửi hồ sơ</h5>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: 16 }}>
                  <div className="text-muted small fw-semibold">NGƯỜI NỘP</div>
                  <div className="fw-bold fs-6 mt-1">{user?.fullName || 'Nguyễn Công Việt'}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div className="text-muted small fw-semibold">LOẠI HỒ SƠ</div>
                  <div className="fw-bold text-danger mt-1">{form.recordCategory}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div className="text-muted small fw-semibold">THỬA ĐẤT LIÊN QUAN</div>
                  <div className="fw-bold mt-1">ID: #{form.landParcelId}</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div className="text-muted small fw-semibold">NỘI DUNG GHI CHÚ</div>
                  <div className="mt-1">{form.notes || 'Không có'}</div>
                </div>
                <div>
                  <div className="text-muted small fw-semibold">TÀI LIỆU ĐÍNH KÈM</div>
                  <div className="mt-1 fw-bold text-primary">{files.length} tài liệu</div>
                </div>
              </div>

              <div style={{ margin: '24px 0', padding: '16px 20px', background: '#fefce8', borderRadius: 10, border: '1px solid #fef08a', fontSize: 14 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={agreed} 
                    onChange={(e) => setAgreed(e.target.checked)} 
                    style={{ marginTop: 4, width: 18, height: 18, accentColor: '#ca8a04' }}
                  />
                  <span style={{ color: '#854d0e', lineHeight: 1.5 }}>
                    Tôi cam đoan các thông tin khai báo là hoàn toàn chính xác và chịu trách nhiệm trước pháp luật về tính trung thực của hồ sơ này.
                  </span>
                </label>
              </div>

              {error && <div className="alert alert-danger mt-3 py-2 small">{error}</div>}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: '14px', border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>Quay lại</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={submitting || !agreed}
                  style={{ flex: 1, padding: '14px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700 }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi hồ sơ ngay'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LandTaxLayout>
  );
};

export default SubmitDeclarationPage;