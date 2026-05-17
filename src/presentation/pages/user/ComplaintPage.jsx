import React, { useState, useEffect } from 'react';
import LandTaxLayout from '../../components/LandTaxLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';
import { userApi } from '../../../infrastructure/api/userApi';

const API_BASE = 'http://localhost:8080/api';
const STATUS_MAP = {
  'PENDING': { label: 'Chờ xử lý', bg: '#fef3c7', color: '#d97706' },     // Màu vàng
  'PROCESSING': { label: 'Đang xử lý', bg: '#dbeafe', color: '#2563eb' },  // Màu xanh dương
  'RESOLVED': { label: 'Đã giải quyết', bg: '#dcfce7', color: '#16a34a' }, // Màu xanh lá
  'REJECTED': { label: 'Từ chối', bg: '#fee2e2', color: '#dc2626' },     // Màu đỏ
};
const ComplaintPage = () => {
  const { user } = useUserInfo();
  const userRaw = JSON.parse(localStorage.getItem('user_info') || '{}');
  // const user = userRaw?.data || userRaw;
  const [userInfo, setUserInfo] = useState(null);

  // Cập nhật State cho khớp với các cột trong bảng `complaints`
  const [form, setForm] = useState({
    title: 'Khiếu nại về thuế đất đai',           // Tương ứng với cột `title`
    taxDeclarationId: '',                         // Tương ứng với cột `tax_declaration_id`
    content: '',                                  // Tương ứng với cột `content`
    file: null,                                   // (UI) File biên lai
    attachment: null,                             // (UI) File đính kèm khác
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    userApi.getMyComplaints()
      .then(list => setComplaints(list))
      .catch(() => {})
      .finally(() => setListLoading(false));
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.content.trim()) {
      setError('Vui lòng nhập nội dung khiếu nại');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Xử lý làm sạch ID (Nếu user nhập "TK-001" thì chỉ lấy số 1 để lưu vào INT)
      const cleanId = form.taxDeclarationId ? parseInt(form.taxDeclarationId.replace(/\D/g, ''), 10) : null;

      // Map chuẩn dữ liệu gửi xuống Backend
      const payload = {
        title: form.title,
        content: form.content,
        taxDeclarationId: isNaN(cleanId) ? null : cleanId
      };

      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Gửi khiếu nại thất bại từ máy chủ.');
      }

      setSuccess(true);
      setForm({ title: 'Khiếu nại về thuế đất đai', taxDeclarationId: '', content: '', file: null, attachment: null });

    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi gửi khiếu nại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Màn hình thành công
  if (success) {
    return (
      <LandTaxLayout user={user}>
        <div className="container py-5 text-center">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '80px' }}></i>
          <h3 className="mt-4 fw-bold">Khiếu nại đã được gửi thành công!</h3>
          <p className="text-muted mt-3">Cơ quan Thuế sẽ xử lý và phản hồi trong thời gian sớm nhất.</p>
          <button 
            className="btn btn-danger mt-4 px-5 fw-semibold"
            style={{ borderRadius: '8px' }}
            onClick={() => setSuccess(false)}
          >
            Tạo khiếu nại mới
          </button>
        </div>
      </LandTaxLayout>
    );
  }

  return (
    <LandTaxLayout user={user}>
      <div className="container py-4" style={{ maxWidth: '760px' }}>
        <div className="mb-4">
          <h3 className="fw-bold">Khiếu nại & Phản ánh</h3>
          <p className="text-muted">Gửi và theo dõi các phản ánh về đất đai và thuế</p>
        </div>

        <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4 p-md-5">
            <h5 className="fw-bold mb-4">Tạo khiếu nại mới</h5>

            <form onSubmit={handleSubmit}>
              {/* Tiêu đề / Loại khiếu nại (Cột title) */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Loại khiếu nại (Tiêu đề)</label>
                <select
                  className="form-select bg-light border-0"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  style={{ padding: '12px', borderRadius: '8px' }}
                >
                  <option value="Khiếu nại về thuế đất đai">Khiếu nại về số tiền thuế đất đai</option>
                  <option value="Khiếu nại về hồ sơ khai báo">Khiếu nại về quá trình xử lý hồ sơ</option>
                  <option value="Khiếu nại về quyết định hành chính">Khiếu nại về quyết định từ chối duyệt</option>
                  <option value="Phản ánh khác về đất đai">Phản ánh khác về đất đai</option>
                </select>
              </div>

              {/* ID Tờ khai (Cột tax_declaration_id) */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Mã Tờ khai / Biên lai liên quan</label>
                <input
                  type="text"
                  name="taxDeclarationId"
                  className="form-control bg-light border-0"
                  placeholder="Nhập ID (Ví dụ: TK-002, 15...)"
                  value={form.taxDeclarationId}
                  onChange={handleChange}
                  style={{ padding: '12px', borderRadius: '8px' }}
                />
              </div>

              {/* File PDF biên lai (UI) */}
              <div className="mb-4">
                <label className="form-label fw-semibold">File PDF biên lai / thông báo thuế</label>
                <div 
                  className="border border-dashed rounded-3 p-4 text-center bg-light"
                  style={{ borderColor: '#cbd5e1', cursor: 'pointer' }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <i className="bi bi-cloud-arrow-up" style={{ fontSize: '32px', color: '#94a3b8' }}></i>
                  <p className="mt-2 mb-1 fw-medium text-dark">Tải lên file PDF</p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  className="d-none"
                  onChange={(e) => handleFileChange(e, 'file')}
                />
                {form.file && <small className="text-success mt-2 d-block fw-semibold"><i className="bi bi-check-lg"></i> Đã chọn: {form.file.name}</small>}
              </div>

              {/* Nội dung chi tiết (Cột content) */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Nội dung chi tiết <span className="text-danger">*</span></label>
                <textarea
                  name="content"
                  className="form-control bg-light border-0"
                  rows="5"
                  placeholder="Nhập chi tiết nội dung phản ánh của bạn..."
                  value={form.content}
                  onChange={handleChange}
                  required
                  style={{ resize: 'vertical', borderRadius: '8px', padding: '12px' }}
                />
              </div>

              {/* Tài liệu đính kèm khác (UI) */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Tài liệu đính kèm khác (nếu có)</label>
                <div 
                  className="border border-dashed rounded-3 p-4 text-center bg-light"
                  style={{ borderColor: '#cbd5e1', cursor: 'pointer' }}
                  onClick={() => document.getElementById('attachmentInput').click()}
                >
                  <i className="bi bi-paperclip" style={{ fontSize: '32px', color: '#94a3b8' }}></i>
                  <p className="mt-2 mb-1 fw-medium text-dark">Nhấn để tải lên file đính kèm</p>
                  <small className="text-muted">Hỗ trợ PDF, JPG, PNG</small>
                </div>
                <input
                  id="attachmentInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="d-none"
                  onChange={(e) => handleFileChange(e, 'attachment')}
                />
                {form.attachment && <small className="text-success mt-2 d-block fw-semibold"><i className="bi bi-check-lg"></i> Đã chọn: {form.attachment.name}</small>}
              </div>

              {error && <div className="alert alert-danger py-2 small mb-4">{error}</div>}

              <button
                type="submit"
                className="btn btn-danger w-100 py-3 fw-bold"
                disabled={loading}
                style={{ fontSize: '15px', borderRadius: '10px' }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span> Đang gửi khiếu nại...</>
                ) : (
                  'Gửi khiếu nại ngay'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Lịch sử khiếu nại */}
        <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">Lịch sử khiếu nại</h5>
            {listLoading ? (
              <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-danger" /></div>
            ) : complaints.length === 0 ? (
              <p className="text-muted text-center py-3" style={{ fontSize: 13 }}>Chưa có khiếu nại nào</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table table-sm" style={{ fontSize: 13 }}>
                  <thead className="table-light">
                    <tr>
                      <th>Mã</th><th>Loại</th><th>Nội dung</th><th>Ngày gửi</th><th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c, i) => {
                      const st = STATUS_MAP[c.status] || { label: c.status, bg: '#f3f4f6', color: '#6b7280' };
                      return (
                        <tr key={c.complaintId || i}>
                          <td className="fw-semibold">KN-{String(c.complaintId || i + 1).padStart(4, '0')}</td>
                          <td>{c.complaintType || '—'}</td>
                          <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.content || '—'}</td>
                          <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                          <td><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </LandTaxLayout>
  );
};

export default ComplaintPage;