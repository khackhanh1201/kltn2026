import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';

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

  const userRaw = JSON.parse(localStorage.getItem('user_info') || '{}');
  const user = userRaw?.data || userRaw;
  const userId = user?.userId || userRaw?.userId;

  // Lấy CCCD
  const token = localStorage.getItem('token') || '';
  let cccdNumber = '';
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      cccdNumber = payload?.cccdNumber || payload?.sub || '';
    }
  } catch (e) {}
  if (!cccdNumber) cccdNumber = user?.cccdNumber || '03709500****';

  const [step, setStep] = useState(1);
  const [landPlots, setLandPlots] = useState([]);
  const [loadingPlots, setLoadingPlots] = useState(false);

  const [form, setForm] = useState({
    declarationType: DECLARATION_TYPES[0],
    landPlotId: '',        // Sẽ lưu ID thật của thửa đất
    content: '',
  });

  const [files, setFiles] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [declarationCode, setDeclarationCode] = useState('');

  // Load danh sách thửa đất khi vào bước 2
  useEffect(() => {
    if (step === 2 && userId && landPlots.length === 0) {
      setLoadingPlots(true);
      fetch(`${API_BASE}/land-parcels/my-assets`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const list = Array.isArray(data) ? data : (data?.data || []);
          setLandPlots(list);
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingPlots(false));
    }
  }, [step, userId]);

  const handleFileSelect = (e) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.landPlotId) {
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
  landParcelId: Number(form.landPlotId),
  declarationType: form.declarationType,
  content: form.content,
};

      const res = await fetch(`${API_BASE}/tax/declarations`, {
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
      setDeclarationCode(`HS-${new Date().getFullYear()}-${result.declarationId || Date.now()}`);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Nộp hồ sơ thất bại');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
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
              Mã hồ sơ: <strong>{declarationCode}</strong>
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
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Hoàn thành các bước để gửi hồ sơ khai báo</p>
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
                  <strong>{user.fullName || 'Nguyễn Công Việt'}</strong>
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

          {/* ==================== BƯỚC 2: THÔNG TIN HỒ SƠ ==================== */}
          {step === 2 && (
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Thông tin hồ sơ</h5>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Loại hồ sơ</label>
                <select
                  value={form.declarationType}
                  onChange={(e) => setForm({ ...form, declarationType: e.target.value })}
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0' }}
                >
                  {DECLARATION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Số vào sổ cấp GCN <span style={{color:'red'}}>*</span></label>
                {loadingPlots ? (
                  <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: 10, color: '#94a3b8' }}>
                    Đang tải danh sách thửa đất...
                  </div>
                ) : (
                  <select
                    value={form.landPlotId}
                    onChange={(e) => setForm({ ...form, landPlotId: e.target.value })}
                    style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0' }}
                  >
                    <option value="">-- Chọn Số vào sổ cấp GCN --</option>
                    {landPlots.map(p => (
  <option
    key={p.landParcelId}
    value={p.landParcelId}
  >
    {p.certificateNumber || p.parcelCode || p.plotNumber}
    {' - '}
    {p.address || 'Không có địa chỉ'}
  </option>
))}
                  </select>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Nội dung khai báo</label>
                <textarea
                  rows="4"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Mô tả chi tiết nội dung hồ sơ..."
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #e2e8f0', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff' }}>Quay lại</button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!form.landPlotId}
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
                style={{ border: '2px dashed #cbd5e1', borderRadius: 12, padding: '60px 20px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => document.getElementById('fileUpload').click()}
              >
                <i className="bi bi-cloud-upload" style={{ fontSize: 48, color: '#94a3b8' }}></i>
                <p style={{ marginTop: 12, fontWeight: 500 }}>Nhấn để tải lên tài liệu</p>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Hoặc kéo thả file vào khu vực này</p>
                <div style={{ marginTop: 16 }}>
                  <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: 20, fontSize: 12, marginRight: 6 }}>PDF</span>
                  <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: 20, fontSize: 12, marginRight: 6 }}>JPG/PNG</span>
                  <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>Tối đa 20MB</span>
                </div>
              </div>
              <input type="file" id="fileUpload" multiple className="d-none" onChange={handleFileSelect} />

              {files.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <strong>DANH SÁCH ĐÃ TẢI LÊN ({files.length})</strong>
                  <ul style={{ marginTop: 8 }}>
                    {files.map((file, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                        {file.name}
                        <button onClick={() => removeFile(index)} style={{ color: '#ef4444', background: 'none', border: 'none' }}>Xóa</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', border: '1px solid #e2e8f0', borderRadius: 12 }}>Quay lại</button>
                <button onClick={() => setStep(4)} style={{ flex: 1, padding: '14px', background: '#a30d11', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700 }}>Tiếp tục →</button>
              </div>
            </div>
          )}

          {/* Bước 4: Kiểm tra & Gửi */}
          {step === 4 && (
            <div>
              <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Kiểm tra & Gửi hồ sơ</h5>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24 }}>
                <div style={{ marginBottom: 12 }}><strong>NGƯỜI NỘP</strong><br />{user.fullName || 'Nguyễn Công Việt'}</div>
                <div style={{ marginBottom: 12 }}><strong>LOẠI HỒ SƠ</strong><br />{form.declarationType}</div>
                <div style={{ marginBottom: 12 }}><strong>NỘI DUNG KHAI BÁO</strong><br />{form.content || 'Không có'}</div>
                <div><strong>TÀI LIỆU ĐÍNH KÈM</strong><br />{files.length} tài liệu</div>
              </div>

              <div style={{ margin: '24px 0', padding: 16, background: '#fefce8', borderRadius: 10, fontSize: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input 
                    type="checkbox" 
                    checked={agreed} 
                    onChange={(e) => setAgreed(e.target.checked)} 
                  />
                  Tôi cam đoan các thông tin khai báo là hoàn toàn chính xác và chịu trách nhiệm trước pháp luật về tính trung thực của hồ sơ này.
                </label>
              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: '14px', border: '1px solid #e2e8f0', borderRadius: 12 }}>Quay lại</button>
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