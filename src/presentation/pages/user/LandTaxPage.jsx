import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';

const API_BASE = 'http://localhost:8080/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// ── Màu trạng thái ──
const STATUS_CONFIG = {
  // Tax records
  PAID:     { label: 'Đã nộp',    bg: '#dcfce7', color: '#16a34a', dot: '#22c55e' },
  PENDING:  { label: 'Chờ nộp',   bg: '#fef9c3', color: '#ca8a04', dot: '#eab308' },
  OVERDUE:  { label: 'Trễ hạn',   bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' },
  // Declarations
  APPROVED: { label: 'Đã duyệt',  bg: '#dcfce7', color: '#16a34a', dot: '#22c55e' },
  REJECTED: { label: 'Từ chối',   bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
};

// ── Donut Chart SVG thuần ──
const DonutChart = ({ paid, pending, overdue }) => {
  const total = paid + pending + overdue || 1;
  const paidPct = paid / total;
  const pendingPct = pending / total;
  const overduePct = overdue / total;

  const r = 54, cx = 70, cy = 70, stroke = 14;
  const circ = 2 * Math.PI * r;

  const paidDash   = paidPct * circ;
  const pendingDash = pendingPct * circ;
  const overdueDash = overduePct * circ;
  const paidOffset   = 0;
  const pendingOffset = -paidDash;
  const overdueOffset = -(paidDash + pendingDash);

  const pct = total > 0 ? Math.round((paid / total) * 100) : 0;

  return (
    <svg viewBox="0 0 140 140" style={{ width: 140, height: 140 }}>
      {/* nền */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {/* overdue */}
      {overdueDash > 0 && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth={stroke}
          strokeDasharray={`${overdueDash} ${circ - overdueDash}`}
          strokeDashoffset={overdueOffset} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }} />
      )}
      {/* pending */}
      {pendingDash > 0 && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#eab308" strokeWidth={stroke}
          strokeDasharray={`${pendingDash} ${circ - pendingDash}`}
          strokeDashoffset={pendingOffset} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }} />
      )}
      {/* paid */}
      {paidDash > 0 && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth={stroke}
          strokeDasharray={`${paidDash} ${circ - paidDash}`}
          strokeDashoffset={paidOffset} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }} />
      )}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize={20} fontWeight={700} fill="#1e293b">{pct}%</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="#64748b">Đã nộp</text>
    </svg>
  );
};

const LandTaxPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  const userId = user?.userId || user?.data?.userId;

  const [taxRecords, setTaxRecords]       = useState([]);
  const [declarations, setDeclarations]   = useState([]);
  const [activeTab, setActiveTab]         = useState('tax'); // 'tax' | 'declarations'
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [recRes, declRes] = await Promise.all([
        fetch(`${API_BASE}/tax/bills/unpaid`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/tax/declarations/my-history`, { headers: getAuthHeaders() }),
      ]);

      if (recRes.ok) {
        const j = await recRes.json();
        setTaxRecords(j.data || []);
      }
      if (declRes.ok) {
        const j = await declRes.json();
        setDeclarations(j.data || []);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // ── Tính toán stats ──
  const paid    = taxRecords.filter(r => r.status === 'PAID').length;
  const pending = taxRecords.filter(r => r.status === 'PENDING').length;
  const overdue = taxRecords.filter(r => r.status === 'OVERDUE').length;
  const total   = taxRecords.length;

  const declPending  = declarations.filter(d => d.status === 'PENDING').length;
  const declApproved = declarations.filter(d => d.status === 'APPROVED').length;
  const declRejected = declarations.filter(d => d.status === 'REJECTED').length;
  const declTotal    = declarations.length;
  const declPct      = declTotal > 0 ? Math.round((declApproved / declTotal) * 100) : 0;

  // ── Cần xử lý ngay ──
  const urgent = [
    ...taxRecords.filter(r => r.status === 'OVERDUE').map(r => ({
      type: 'overdue', label: `Thuế trễ hạn — ${r.parcelCode || 'Thửa #' + r.parcelId}`,
      detail: `Năm ${r.taxYear} · ${Number(r.taxAmount).toLocaleString('vi-VN')} ₫`,
      color: '#ef4444',
    })),
    ...taxRecords.filter(r => r.status === 'PENDING').map(r => ({
      type: 'pending', label: `Thuế đến hạn nộp — ${r.parcelCode || 'Thửa #' + r.parcelId}`,
      detail: r.dueDate ? `Hạn: ${new Date(r.dueDate).toLocaleDateString('vi-VN')}` : '',
      color: '#f59e0b',
    })),
    ...declarations.filter(d => d.status === 'PENDING').map(d => ({
      type: 'decl', label: `Tờ khai chờ duyệt — ${d.parcelCode || 'Thửa #' + d.parcelId}`,
      detail: `Năm ${d.taxYear}`,
      color: '#3b82f6',
    })),
  ];

  const formatCurrency = (v) =>
    v != null ? Number(v).toLocaleString('vi-VN') + ' ₫' : '—';

  const formatDate = (v) =>
    v ? new Date(v).toLocaleDateString('vi-VN') : '—';

  return (
    <LandTaxLayout user={user}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 8 }}>
        <h4 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>Tổng quan</h4>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
          Theo dõi trạng thái thuế và hồ sơ của bạn
        </p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div className="spinner-border text-danger" role="status" />
          <p style={{ marginTop: 12 }}>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* ── Row 1: 3 card stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>

            {/* Trạng thái thuế */}
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={styles.cardLabel}>Trạng thái thuế</p>
                  <p style={styles.cardSub}>Tổng khoản thuế: {total}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 8 }}>
                <DonutChart paid={paid} pending={pending} overdue={overdue} />
                <div style={{ flex: 1 }}>
                  {[
                    { label: 'Đã nộp',  count: paid,    color: '#22c55e' },
                    { label: 'Chờ nộp', count: pending, color: '#eab308' },
                    { label: 'Trễ hạn', count: overdue, color: '#ef4444' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cần xử lý ngay */}
            <div style={{ ...styles.card, background: urgent.length > 0 ? '#fff8f8' : '#fff', border: urgent.length > 0 ? '1px solid #fecaca' : '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                {urgent.length > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>!</span>
                )}
                <p style={{ ...styles.cardLabel, margin: 0 }}>Cần xử lý ngay</p>
              </div>
              {urgent.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>
                  <i className="bi bi-check-circle" style={{ fontSize: 28, color: '#22c55e' }} />
                  <p style={{ fontSize: 12, marginTop: 8 }}>Không có việc cần xử lý</p>
                </div>
              ) : (
                <div style={{ fontSize: 13 }}>
                  <div style={{ background: '#fff7ed', borderRadius: 8, padding: '8px 12px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#92400e' }}>Tổng số việc</span>
                    <span style={{ fontWeight: 700, color: '#dc2626', fontSize: 28 }}>{urgent.length}</span>
                  </div>
                  {urgent.slice(0, 3).map((u, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#475569', fontSize: 12 }}>{u.label}</span>
                      <span style={{ background: u.color + '20', color: u.color, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {u.type === 'overdue' ? 'Trễ hạn' : u.type === 'pending' ? 'Chờ nộp' : 'Chờ duyệt'}
                      </span>
                    </div>
                  ))}
                  {urgent.length > 3 && (
                    <p style={{ color: '#94a3b8', fontSize: 11, textAlign: 'center', marginTop: 6 }}>+{urgent.length - 3} việc khác</p>
                  )}
                </div>
              )}
            </div>

            {/* Trạng thái hồ sơ */}
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <p style={styles.cardLabel}>Trạng thái hồ sơ</p>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Tổng hồ sơ: {declTotal}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Tỷ lệ hoàn thành</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{declPct}%</span>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${declPct}%`, background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: 10, transition: 'width 0.5s ease' }} />
                </div>
              </div>
              {[
                { label: 'Đang xử lý', count: declPending,  color: '#eab308', pct: declTotal > 0 ? Math.round(declPending/declTotal*100) : 0 },
                { label: 'Đã hoàn thành', count: declApproved, color: '#22c55e', pct: declPct },
                { label: 'Từ chối', count: declRejected, color: '#ef4444', pct: declTotal > 0 ? Math.round(declRejected/declTotal*100) : 0 },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.pct}%</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', minWidth: 20, textAlign: 'right' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Chức năng ── */}
          <div style={{ marginBottom: 16 }}>
            <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 12, fontSize: 15 }}>Chức năng</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: 'bi-search', label: 'Tra cứu thông tin đất', desc: 'Tra cứu thông tin quy hoạch, diện tích, giá đất', onClick: () => {} },
                { icon: 'bi-file-earmark-plus', label: 'Nộp hồ sơ khai thuế đất', desc: 'Tạo mới và gửi hồ sơ khai báo thuế đất', onClick: () => navigate('/property-declaration') },
                { icon: 'bi-credit-card', label: 'Nộp thuế', desc: 'Thanh toán trực tuyến các khoản thuế đất', onClick: () => {} },
                { icon: 'bi-clock-history', label: 'Theo dõi trạng thái hồ sơ', desc: 'Kiểm tra tiến độ xử lý hồ sơ đã nộp', onClick: () => setActiveTab('declarations') },
                { icon: 'bi-chat-left-text', label: 'Gửi khiếu nại', desc: 'Gửi phản ánh, thắc mắc về thuế đất', onClick: () => navigate('/complaint') },
              ].map((fn, i) => (
                <div
                  key={i}
                  onClick={fn.onClick}
                  style={{
                    background: '#fff', borderRadius: 12, padding: '16px 20px',
                    border: '1px solid #f1f5f9', cursor: 'pointer',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`bi ${fn.icon}`} style={{ fontSize: 17, color: '#f97316' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', margin: 0 }}>{fn.label}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, marginTop: 2 }}>{fn.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Hoạt động gần đây ── */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h5 style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: 15 }}>Hoạt động gần đây</h5>
              <button onClick={fetchAll} style={{ background: 'none', border: 'none', color: '#f97316', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                <i className="bi bi-arrow-clockwise me-1" />Làm mới
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #f1f5f9', marginBottom: 16 }}>
              {[
                { key: 'tax',          label: 'Lịch sử nộp thuế' },
                { key: 'declarations', label: 'Lịch sử nộp hồ sơ' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  background: 'none', border: 'none', padding: '8px 16px', cursor: 'pointer',
                  fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 400,
                  color: activeTab === tab.key ? '#f97316' : '#94a3b8',
                  borderBottom: activeTab === tab.key ? '2px solid #f97316' : '2px solid transparent',
                  marginBottom: -1, transition: 'all 0.2s',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Bảng lịch sử nộp thuế */}
            {activeTab === 'tax' && (
              taxRecords.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                  <i className="bi bi-inbox" style={{ fontSize: 32 }} />
                  <p style={{ marginTop: 8, fontSize: 13 }}>Chưa có bản ghi thuế nào</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Mã giao dịch/Hồ sơ', 'Ngày tháng', 'Thửa đất', 'Nội dung', 'Số tiền', 'Trạng thái'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {taxRecords.map((r, i) => (
                        <tr key={r.taxId} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>TX-{String(r.taxId).padStart(3, '0')}</td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{formatDate(r.createdAt)}</td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{r.parcelCode || 'Thửa #' + r.parcelId}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>Thuế đất năm {r.taxYear}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{formatCurrency(r.taxAmount)}</td>
                          <td style={{ padding: '10px 14px' }}><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* Bảng lịch sử hồ sơ */}
            {activeTab === 'declarations' && (
              declarations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                  <i className="bi bi-inbox" style={{ fontSize: 32 }} />
                  <p style={{ marginTop: 8, fontSize: 13 }}>Chưa có hồ sơ nào</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Mã hồ sơ', 'Ngày nộp', 'Thửa đất', 'Năm thuế', 'Diện tích (m²)', 'Mục đích', 'Trạng thái'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {declarations.map((d, i) => (
                        <tr key={d.declarationId} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>HS-{String(d.declarationId).padStart(3, '0')}</td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{formatDate(d.createdAt)}</td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>{d.parcelCode || 'Thửa #' + d.parcelId}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{d.taxYear}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{d.declaredArea?.toLocaleString('vi-VN')}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{d.declaredPurpose || '—'}</td>
                          <td style={{ padding: '10px 14px' }}><StatusBadge status={d.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </>
      )}
    </LandTaxLayout>
  );
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: 14,
    padding: '20px 22px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  cardLabel: {
    fontWeight: 700,
    fontSize: 14,
    color: '#1e293b',
    margin: '0 0 2px 0',
  },
  cardSub: {
    fontSize: 12,
    color: '#94a3b8',
    margin: 0,
  },
};

export default LandTaxPage;