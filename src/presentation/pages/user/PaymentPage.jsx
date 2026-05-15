import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';

const API_BASE = 'http://localhost:8080/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user } = useUserInfo();
  // const user = JSON.parse(localStorage.getItem('user_info') || '{}');

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy danh sách khoản phải thanh toán (từ tax/records chưa thanh toán)
  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tax/bills/unpaid`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Không thể tải danh sách thanh toán');

      const json = await res.json();
      const allRecords = json.data || json || [];
      console.log(allRecords);

      // Lọc và map chuẩn xác các trường theo Database (hỗ trợ cả camelCase và snake_case)
      const pendingList = allRecords.map(r => {
        const id = r.pay_id || r.bill_id || r.id || r.billId || r.payId;
        const taxYear = r.tax_year || r.taxYear || new Date().getFullYear();
        
        return {
          paymentId: id,
          code: `PAY-${taxYear}-${String(id).padStart(5, '0')}`,
          type: r.tax_name || 'Thuế sử dụng đất phi nông nghiệp',
          parcel: r.parcel_number || r.parcelCode || r.description || `Thửa đất #${r.land_parcel_id || r.parcelId || '—'}`,
          area: r.declared_area || r.declaredArea || r.calculated_area || '—',
          taxRate: r.tax_rate || r.taxRate || r.applied_tax_rate ? `${r.tax_rate || r.taxRate || r.applied_tax_rate}%` : '—',
          amount: Number(r.total_amount_due || r.amount || 0),
          dueDate: formatDate(r.due_date || r.dueDate),
          status: r.payment_status || r.status || 'UNPAID'
        };
      });

      setPayments(pendingList);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi format ngày
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  };

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  // === Gọi API tạo link thanh toán thật (PayOS/VNPay) ===
  const handlePayment = async (item) => {
    try {
      console.log("Đang tạo link thanh toán cho:", item);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${API_BASE}/payments/${item.paymentId}/create-link`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Không thể tạo link thanh toán từ cổng thanh toán');
      }

      console.log(result);
      const checkoutUrl = result.checkoutUrl || result.data?.checkoutUrl;

      if (checkoutUrl) {
        // Chuyển hướng người dùng sang trang của cổng thanh toán
        window.open(checkoutUrl, '_blank');
      } else {
        alert('Cổng thanh toán không trả về link (checkoutUrl bị trống)');
      }

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <LandTaxLayout user={user}>
      <div className="container py-4" style={{ maxWidth: '900px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-danger mb-1">Thanh toán</h3>
            <p className="text-muted mb-0">Quản lý nghĩa vụ tài chính và lịch sử giao dịch</p>
          </div>
          <div>
            <button className="btn btn-danger fw-semibold me-2">Chờ thanh toán</button>
            <button className="btn btn-light border fw-semibold text-secondary" onClick={() => navigate('/tax')}>Lịch sử giao dịch</button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Đang tải danh sách khoản phải nộp...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-5 text-muted bg-white rounded-4 border shadow-sm">
            <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem', color: '#10b981' }} />
            <h5 className="mt-3 fw-bold text-dark">Tuyệt vời!</h5>
            <p className="mb-0">Bạn không có khoản thuế nào đang chờ thanh toán.</p>
          </div>
        ) : (
          <div className="row g-4">
            {payments.map((item, index) => (
              <div key={index} className="col-12">
                <div className="card h-100 shadow-sm" style={{ borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                  <div className="card-body p-4 p-md-5">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-dark">{item.type}</h5>
                        <div className="text-muted font-monospace small">Mã tham chiếu: {item.code}</div>
                      </div>
                      <span className="badge bg-warning bg-opacity-10 text-warning border border-warning px-3 py-2 rounded-pill fw-semibold">
                        <i className="bi bi-clock-history me-1"></i> Hạn nộp: {item.dueDate}
                      </span>
                    </div>

                    <div className="bg-light rounded-4 p-4 mb-4 border">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <small className="text-muted fw-semibold">THỬA ĐẤT LIÊN QUAN</small>
                          <div className="fw-bold text-dark mt-1">{item.parcel}</div>
                        </div>
                        <div className="col-6 col-md-3">
                          <small className="text-muted fw-semibold">DIỆN TÍCH</small>
                          <div className="fw-bold text-dark mt-1">{item.area !== '—' ? `${item.area} m²` : '—'}</div>
                        </div>
                        <div className="col-6 col-md-3">
                          <small className="text-muted fw-semibold">THUẾ SUẤT</small>
                          <div className="fw-bold text-dark mt-1">{item.taxRate}</div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4">
                      <div>
                        <small className="text-muted fw-bold">SỐ TIỀN CẦN NỘP</small>
                        <h3 className="fw-bold text-danger mb-0 mt-1">
                          {formatCurrency(item.amount)}
                        </h3>
                      </div>

                      <div className="d-flex gap-2 w-100 w-md-auto">
                        <button 
                          className="btn btn-outline-danger fw-semibold flex-grow-1 flex-md-grow-0 px-4 py-2"
                          style={{ borderRadius: '8px' }}
                          onClick={() => navigate('/tax')}
                        >
                          Xem chi tiết
                        </button>
                        <button 
                          className="btn btn-danger fw-semibold flex-grow-1 flex-md-grow-0 px-4 py-2 d-flex justify-content-center align-items-center gap-2"
                          style={{ borderRadius: '8px' }}
                          onClick={() => handlePayment(item)}
                        >
                          <i className="bi bi-credit-card"></i> Thanh toán ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LandTaxLayout>
  );
};

export default PaymentPage;