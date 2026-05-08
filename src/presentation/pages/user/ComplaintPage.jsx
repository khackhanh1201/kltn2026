import React, { useState } from 'react';
import LandTaxLayout from '../components/LandTaxLayout';

const ComplaintPage = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');

  const [form, setForm] = useState({
    complaintType: 'Khiếu nại về thuế đất đai',   // Loại khiếu nại mặc định
    taxCode: '',                                  // Mã số thuế / mã biên lai
    content: '',                                  // Nội dung chi tiết
    file: null,                                   // File PDF biên lai
    attachment: null,                             // Tài liệu đính kèm khác
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
      // TODO: Gọi API thật sau khi backend có endpoint
      // const formData = new FormData();
      // formData.append('complaintType', form.complaintType);
      // formData.append('taxCode', form.taxCode);
      // formData.append('content', form.content);
      // if (form.file) formData.append('file', form.file);
      // if (form.attachment) formData.append('attachment', form.attachment);

      // const res = await fetch('http://localhost:9090/api/complaints', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      //   body: formData,
      // });

      // Giả lập thành công
      await new Promise(resolve => setTimeout(resolve, 800));

      setSuccess(true);
      setForm({ complaintType: 'Khiếu nại về thuế đất đai', taxCode: '', content: '', file: null, attachment: null });

    } catch (err) {
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
          <p className="text-muted mt-3">Chúng tôi sẽ xử lý và phản hồi trong thời gian sớm nhất.</p>
          <button 
            className="btn btn-danger mt-4 px-5"
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
      </div>
    </LandTaxLayout>
  );
};

export default ComplaintPage;