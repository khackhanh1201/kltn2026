import React, { useState, useEffect } from 'react';
import LandTaxLayout from '../../components/LandTaxLayout';
import { userApi } from '../../../infrastructure/api/userApi';

const STATUS_MAP = {
  PENDING:  { label: 'Chờ xử lý', bg: '#fef9c3', color: '#ca8a04' },
  RESOLVED: { label: 'Đã giải quyết', bg: '#dcfce7', color: '#16a34a' },
  REJECTED: { label: 'Từ chối',    bg: '#fee2e2', color: '#dc2626' },
};

const ComplaintPage = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');

  const [form, setForm] = useState({
    complaintType: 'Khiếu nại về thuế đất đai',
    taxCode: '',
    content: '',
    file: null,
    attachment: null,
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
      await userApi.submitComplaint({
        complaintType: form.complaintType,
        taxCode: form.taxCode,
        content: form.content,
      });
      setSuccess(true);
      setForm({ complaintType: 'Khiếu nại về thuế đất đai', taxCode: '', content: '', file: null, attachment: null });
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi gửi khiếu nại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Banner thành công inline (không thay trang)
  const SuccessBanner = () => (
    <div className="alert alert-success d-flex align-items-center gap-3 mb-4" style={{ borderRadius: 12 }}>
      <i className="bi bi-check-circle-fill" style={{ fontSize: 24 }} />
      <div>
        <strong>Gửi khiếu nại thành công!</strong>
        <p className="mb-0" style={{ fontSize: 13 }}>Chúng tôi sẽ xử lý và phản hồi trong thời gian sớm nhất.</p>
      </div>
      <button className="btn-close ms-auto" onClick={() => setSuccess(false)} />
    </div>
  );

  return (
    <LandTaxLayout user={user}>
      <div className="container py-4" style={{ maxWidth: '760px' }}>
        <div className="mb-4">
          <h3 className="fw-bold">Khiếu nại & Phản ánh</h3>
          <p className="text-muted">Gửi và theo dõi các phản ánh về đất đai và thuế</p>
        </div>

        {success && <SuccessBanner />}

        <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-5">
            <h5 className="fw-bold mb-4">Tạo khiếu nại mới</h5>

            <form onSubmit={handleSubmit}>
              {/* Loại khiếu nại */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Loại khiếu nại</label>
                <select
                  className="form-select"
                  name="complaintType"
                  value={form.complaintType}
                  onChange={handleChange}
                  style={{ padding: '12px' }}
                >
                  <option value="Khiếu nại về thuế đất đai">Khiếu nại về thuế đất đai</option>
                  <option value="Khiếu nại về hồ sơ khai báo">Khiếu nại về hồ sơ khai báo</option>
                  <option value="Khiếu nại về quyết định hành chính">Khiếu nại về quyết định hành chính</option>
                  <option value="Phản ánh khác về đất đai">Phản ánh khác về đất đai</option>
                </select>
              </div>

              {/* Thông tin thuế đất đai khiếu nại */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Thông tin thuế đất đai khiếu nại</label>
                <input
                  type="text"
                  name="taxCode"
                  className="form-control"
                  placeholder="Nhập mã số thuế / mã biên lai..."
                  value={form.taxCode}
                  onChange={handleChange}
                  style={{ padding: '12px' }}
                />
              </div>

              {/* File PDF biên lai / thông báo thuế */}
              <div className="mb-4">
                <label className="form-label fw-semibold">File PDF biên lai / thông báo thuế</label>
                <div 
                  className="border border-dashed rounded-3 p-5 text-center"
                  style={{ borderColor: '#cbd5e1', cursor: 'pointer' }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <i className="bi bi-cloud-arrow-up" style={{ fontSize: '42px', color: '#94a3b8' }}></i>
                  <p className="mt-3 mb-1 fw-medium">Tải lên file PDF</p>
                  <small className="text-muted">Hỗ trợ định dạng PDF</small>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  className="d-none"
                  onChange={(e) => handleFileChange(e, 'file')}
                />
                {form.file && <small className="text-success mt-2 d-block">✓ Đã chọn: {form.file.name}</small>}
              </div>

              {/* Nội dung chi tiết */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Nội dung chi tiết</label>
                <textarea
                  name="content"
                  className="form-control"
                  rows="5"
                  placeholder="Nhập nội dung khiếu nại của bạn..."
                  value={form.content}
                  onChange={handleChange}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Tài liệu đính kèm khác */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Tài liệu đính kèm khác (nếu có)</label>
                <div 
                  className="border border-dashed rounded-3 p-5 text-center"
                  style={{ borderColor: '#cbd5e1', cursor: 'pointer' }}
                  onClick={() => document.getElementById('attachmentInput').click()}
                >
                  <i className="bi bi-cloud-arrow-up" style={{ fontSize: '42px', color: '#94a3b8' }}></i>
                  <p className="mt-3 mb-1 fw-medium">Nhấn để tải lên hoặc kéo thả file vào đây</p>
                  <small className="text-muted">Hỗ trợ PDF, JPG, PNG (Tối đa 10MB)</small>
                </div>
                <input
                  id="attachmentInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="d-none"
                  onChange={(e) => handleFileChange(e, 'attachment')}
                />
                {form.attachment && <small className="text-success mt-2 d-block">✓ Đã chọn: {form.attachment.name}</small>}
              </div>

              {error && <div className="alert alert-danger mb-4">{error}</div>}

              <button
                type="submit"
                className="btn btn-danger w-100 py-3 fw-bold"
                disabled={loading}
                style={{ fontSize: '16px' }}
              >
                {loading ? 'Đang gửi khiếu nại...' : 'Gửi khiếu nại'}
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