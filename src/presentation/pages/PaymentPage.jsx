import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../components/LandTaxLayout';

const API_BASE = 'http://localhost:9090/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');

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
      const res = await fetch(`${API_BASE}/tax/records`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Không thể tải danh sách thanh toán');

      const json = await res.json();
      const allRecords = json.data || json || [];

      // Lọc chỉ các khoản chưa thanh toán
      const pendingList = allRecords
        .filter(r => r.status === 'PENDING' || r.status === 'OVERDUE')
        .map(r => ({
          paymentId: null,           // sẽ được tạo sau khi gọi /payments/create
          referenceId: r.taxId,
          referenceType: 'TAX',
          code: r.parcelCode || `TAX-${r.taxId}`,
          type: 'Thuế sử dụng đất',
          parcel: r.parcelCode || 'Thửa đất',
          area: '— m²',
          taxRate: '—',
          amount: Number(r.taxAmount || 0),
          dueDate: r.dueDate ? new Date(r.dueDate).toLocaleDateString('vi-VN') : '—',
          status: r.status
        }));

      setPayments(pendingList);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === Gọi API tạo link thanh toán thật ===
  const handlePayment = async (item) => {
    try {
      const requestBody = {
        referenceId: item.referenceId,
        referenceType: item.referenceType,
        // amount: item.amount,        // backend sẽ tự lấy từ TaxRecord
      };

      const res = await fetch(`${API_BASE}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Không thể tạo link thanh toán');
      }

      // Backend trả về checkoutUrl từ PayOS
      const checkoutUrl = result.data?.checkoutUrl || result.checkoutUrl;

      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');   // Mở trang thanh toán PayOS
      } else {
        alert('Không nhận được link thanh toán từ PayOS. Vui lòng thử lại!');
      }
    } catch (err) {
      alert('Lỗi thanh toán: ' + err.message);
      console.error(err);
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <LandTaxLayout user={user}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-danger mb-1">Thanh toán</h3>
            <p className="text-muted mb-0">Quản lý nghĩa vụ tài chính và lịch sử giao dịch</p>
          </div>
          <div>
            <button className="btn btn-outline-danger me-2">Chờ thanh toán</button>
            <button className="btn btn-outline-secondary">Lịch sử giao dịch</button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3">Đang tải danh sách khoản phải nộp...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-check-circle fs-1 text-success" />
            <p className="mt-3">Bạn không có khoản thanh toán nào đang chờ.</p>
          </div>
        ) : (
          <div className="row g-4">
            {payments.map((item, index) => (
              <div key={index} className="col-lg-6">
                <div className="card h-100 shadow-sm" style={{ borderRadius: '16px', border: 'none' }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{item.type}</h5>
                        <small className="text-muted">{item.code}</small>
                      </div>
                      <span className="badge bg-warning text-dark">
                        Hạn nộp: {item.dueDate}
                      </span>
                    </div>

                    <div className="bg-light rounded-3 p-3 mb-4">
                      <div className="mb-2">
                        <small className="text-muted">Thửa đất</small>
                        <div className="fw-medium">{item.parcel}</div>
                      </div>
                      <div className="d-flex gap-4">
                        <div>
                          <small className="text-muted">Diện tích</small>
                          <div>{item.area}</div>
                        </div>
                        <div>
                          <small className="text-muted">Thuế suất</small>
                          <div>{item.taxRate}</div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-end">
                      <div>
                        <small className="text-muted">SỐ TIỀN CẦN NỘP</small>
                        <h4 className="fw-bold text-danger mb-0">
                          {formatCurrency(item.amount)}
                        </h4>
                      </div>

                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => alert('Chức năng xem chi tiết sẽ được triển khai sau')}
                        >
                          Xem chi tiết
                        </button>
                        <button 
                          className="btn btn-danger px-4"
                          onClick={() => handlePayment(item)}
                        >
                          Thanh toán ngay
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