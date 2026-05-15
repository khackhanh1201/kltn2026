import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';

const API_BASE = 'http://localhost:8080/api';
const getAuth  = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });

const formatVND  = (v) => v != null ? Number(v).toLocaleString('vi-VN') + ' VND' : '—';
const formatDate = (v) => v ? new Date(v).toLocaleDateString('vi-VN') : '—';

const TAX_LABELS = {
  ONT: 'Thuế sử dụng đất phi nông nghiệp',
  ODT: 'Thuế sử dụng đất phi nông nghiệp (Đô thị)',
  CLN: 'Thuế sử dụng đất nông nghiệp',
  TMD: 'Thuế thương mại, dịch vụ',
  SKC: 'Thuế cơ sở sản xuất kinh doanh',
  LPT: 'Lệ phí trước bạ',
};

const getTaxLabel = (r) => {
  // Lấy ra mã loại đất từ mã thửa (VD: ODT-1234 -> ODT)
  if (r.parcelCode) { 
    const p = r.parcelCode.split('-')[0]; 
    if (TAX_LABELS[p]) return TAX_LABELS[p]; 
  }
  return 'Thuế sử dụng đất phi nông nghiệp';
};

const StatusBadge = ({ status }) => {
  const cfg = status === 'PAID'
    ? { label: 'Đã hoàn thành', bg: '#dcfce7', color: '#16a34a' }
    : status === 'OVERDUE'
    ? { label: 'Trễ hạn', bg: '#fee2e2', color: '#dc2626' }
    : { label: 'Chưa thanh toán', bg: '#fef9c3', color: '#ca8a04' }; // PENDING hoặc UNPAID
    
  return (
    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
};

const TaxPage = () => {
  const navigate = useNavigate();
  const { user } = useUserInfo();
  const [records,   setRecords]   = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [tab,       setTab]       = useState('all');
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);
  const [showAdv,   setShowAdv]   = useState(false);
  const [adv, setAdv] = useState({ name: '', year: '', amount: '', status: '' });

  useEffect(() => { fetchRecords(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(records.filter(r => {
      const matchTab    = tab === 'all' ? true : tab === 'unpaid' ? (r.status === 'UNPAID' || r.status === 'PENDING' || r.status === 'OVERDUE') : r.status === 'PAID';
      const matchSearch = !q || (r.parcelCode||'').toLowerCase().includes(q) || getTaxLabel(r).toLowerCase().includes(q) || String(r.taxId).includes(q);
      const matchName   = !adv.name   || getTaxLabel(r).toLowerCase().includes(adv.name.toLowerCase());
      const matchYear   = !adv.year   || String(r.taxYear) === adv.year;
      const matchAmt    = !adv.amount || Number(r.taxAmount) >= Number(adv.amount);
      const matchStatus = !adv.status || r.status === adv.status;
      return matchTab && matchSearch && matchName && matchYear && matchAmt && matchStatus;
    }));
  }, [records, tab, search, adv]);

  const fetchRecords = async () => {
    setLoading(true);

    try {
      const [unpaidRes, paidRes, declRes] = await Promise.all([
        fetch(`${API_BASE}/tax/bills/unpaid`, { headers: getAuth() }),
        fetch(`${API_BASE}/tax/bills/paid`, { headers: getAuth() }),
        fetch(`${API_BASE}/tax/declarations/my-history`, { headers: getAuth() }),
      ]);

      const unpaidBills = await unpaidRes.json();
      const paidBills   = await paidRes.json();
      const declarations = await declRes.json();

      const allBills = [...(unpaidBills.data || unpaidBills || []), ...(paidBills.data || paidBills || [])];
      const allDecls = declarations.data || declarations || [];

      // Nhào nặn dữ liệu: Mix bảng tax_bills/tax_payments với tax_declarations
      const merged = allBills.map(bill => {
        const declId = bill.declaration_id || bill.declarationId;
        const decl = allDecls.find(d => d.id === declId);

        let st = bill.payment_status || bill.status || 'UNPAID';
        const due = bill.due_date || bill.dueDate;

        // Tự động gán Trễ hạn nếu vượt quá ngày nộp
        if ((st === 'UNPAID' || st === 'PENDING') && due && new Date(due) < new Date()) {
          st = 'OVERDUE';
        }

        return {
          taxId: bill.pay_id || bill.bill_id || bill.id || bill.billId,
          declarationId: declId || decl?.id,
          
          taxAmount: bill.total_amount_due || bill.amount || 0,
          status: st,
          
          taxYear: bill.tax_year || bill.taxYear || decl?.tax_year || decl?.taxYear || '—',
          parcelId: bill.land_parcel_id || bill.parcelId || decl?.parcel_id || decl?.parcelId || '—',
          parcelCode: bill.parcel_number || bill.parcelCode || decl?.parcel_number || decl?.parcelCode,
          
          dueDate: due,
          paidAt: bill.paid_at || bill.paidAt,
          
          // Lấy chi tiết tính toán từ tax_declarations hoặc tax_bills
          declaredArea: decl?.declared_area || decl?.declaredArea || '—',
          taxRate: decl?.tax_rate || decl?.taxRate || '—',
          unitPrice: decl?.unit_price || decl?.unitPrice || '—',
          formula: bill.calculation_formula || bill.calculationFormula || decl?.calculation_formula || '',
        };
      });

      // Sắp xếp ID lớn nhất (mới nhất) lên đầu
      merged.sort((a, b) => b.taxId - a.taxId);
      setRecords(merged);

    } catch (e) {
      console.error("Lỗi lấy dữ liệu hóa đơn:", e);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (r) => {
    setSelected(r);
  };

  return (
    <LandTaxLayout user={user}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 26, color: '#0f172a', margin: 0 }}>Thuế đất đai</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Quản lý các khoản thuế và nghĩa vụ tài chính</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm mã thửa, loại thuế..."
              style={{ padding: '9px 14px 9px 36px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', width: 260 }} />
          </div>
          <button onClick={() => setShowAdv(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#c8102e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <i className="bi bi-funnel" /> Tìm kiếm nâng cao
          </button>
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
          {[{ key: 'all', label: 'Tất cả' }, { key: 'unpaid', label: 'Chưa thanh toán' }, { key: 'paid', label: 'Đã thanh toán' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: tab === t.key ? '2px solid #c8102e' : '2px solid #e2e8f0',
              background: tab === t.key ? '#fff0f2' : '#fff',
              color: tab === t.key ? '#c8102e' : '#64748b',
            }}>{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            <div className="spinner-border text-danger" role="status" />
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e2e8f0' }}>
                {['MÃ THỬA ĐẤT', 'TÊN TÀI KHOẢN THU', 'NĂM TÍNH THUẾ', 'SỐ TIỀN', 'HẠN NỘP', 'TRẠNG THÁI', 'THAO TÁC'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '50px', color: '#94a3b8', fontSize: 13 }}>Không có dữ liệu thuế nào.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.taxId || i} style={{ borderBottom: '1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a', fontSize: 13 }}>{r.parcelCode || `TĐ-${String(r.parcelId).padStart(5,'0')}`}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>{getTaxLabel(r)}</td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: 13 }}>Năm {r.taxYear}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a', fontSize: 13 }}>{formatVND(r.taxAmount)}</td>
                  <td style={{ padding: '14px 16px', color: r.status === 'OVERDUE' ? '#dc2626' : '#475569', fontSize: 13 }}>{formatDate(r.dueDate)}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openDetail(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#c8102e'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                        <i className="bi bi-eye" />
                      </button>
                      {(r.status === 'UNPAID' || r.status === 'PENDING' || r.status === 'OVERDUE') && (
                        <button onClick={() => navigate('/payment')} style={{ background: '#c8102e', border: 'none', cursor: 'pointer', color: '#fff', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                          <i className="bi bi-credit-card" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal Biên lai / Chi tiết tính thuế ── */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(2px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: 580, maxWidth: '92vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="bi bi-arrow-left" onClick={() => setSelected(null)} style={{ cursor: 'pointer', color: '#64748b', fontSize: 16 }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>Chi tiết khoản thuế</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 20 }}>×</button>
            </div>

            {/* Body */}
            <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', marginBottom: 20 }}>
                <h5 style={{ textAlign: 'center', fontWeight: 800, fontSize: 16, letterSpacing: '0.05em', margin: '0 0 4px' }}>BIÊN LAI / THÔNG BÁO THUẾ</h5>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', margin: '0 0 20px' }}>Mã tham chiếu: TAX-{selected.taxYear}-{String(selected.taxId).padStart(5,'0')}</p>
                <div style={{ height: 1, background: '#e2e8f0', marginBottom: 16 }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 3px' }}>Loại thuế / Lệ phí</p>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{getTaxLabel(selected)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 3px' }}>Năm tính thuế</p>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Năm {selected.taxYear}</p>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 3px' }}>Thông tin tài sản</p>
                <p style={{ fontSize: 13, color: '#475569', margin: '0 0 4px' }}>
                  Mã thửa đất: <span style={{ color: '#c8102e', fontWeight: 700 }}>{selected.parcelCode || `Thửa #${selected.parcelId}`}</span>
                </p>
                <p style={{ fontSize: 13, color: '#475569', margin: '0 0 16px' }}>Mã Tờ khai gốc: {selected.declarationId ? `TK-${selected.declarationId}` : '—'}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 3px' }}>Số tiền phải nộp</p>
                    <p style={{ fontWeight: 800, fontSize: 18, color: '#c8102e', margin: 0 }}>{formatVND(selected.taxAmount)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 3px' }}>Trạng thái</p>
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                {/* Chi tiết tính thuế (Map từ DB) */}
                <div style={{ background: '#fafafa', borderRadius: 10, padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <i className="bi bi-calculator" style={{ color: '#475569' }} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Chi tiết tính thuế</span>
                  </div>
                  {[
                    { label: 'Diện tích chịu thuế:', value: selected.declaredArea !== '—' ? `${selected.declaredArea} m²` : '—' },
                    { label: 'Giá đất áp dụng:', value: selected.unitPrice !== '—' ? `${Number(selected.unitPrice).toLocaleString()} đ/m²` : '—' },
                    { label: 'Hệ số / Thuế suất:', value: selected.taxRate !== '—' ? `${selected.taxRate}%` : '—' },
                    { label: 'Công thức:', value: selected.formula || 'Tính theo biểu giá nhà nước hiện hành', italic: true },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: '#64748b' }}>{row.label}</span>
                      <span style={{ color: '#0f172a', fontStyle: row.italic ? 'italic' : 'normal', textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => navigate('/complaint')}
                style={{ padding: '10px 18px', background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="bi bi-chat-left-text" /> Khiếu nại
              </button>
              <button onClick={() => setSelected(null)}
                style={{ padding: '10px 18px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Đóng
              </button>
              {(selected.status === 'UNPAID' || selected.status === 'PENDING' || selected.status === 'OVERDUE') && (
                <button onClick={() => navigate('/payment')} style={{ padding: '10px 18px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i className="bi bi-credit-card" /> Thanh toán
                </button>
              )}
              {selected.status === 'PAID' && (
                <button style={{ padding: '10px 18px', background: '#c8102e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i className="bi bi-download" /> Tải biên lai
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Tìm kiếm nâng cao ── */}
      {showAdv && (
        <div onClick={() => setShowAdv(false)} style={{ position: 'fixed', inset: 0, zIndex: 2000 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 70, right: 32, background: '#fff', borderRadius: 12, width: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', padding: '20px 24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Bộ lọc nâng cao</span>
              <button onClick={() => setShowAdv(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}>×</button>
            </div>
            {[
              { label: 'Tên tài khoản thu (Loại đất)', key: 'name', placeholder: 'VD: ODT, Thuế đất...' },
              { label: 'Năm tính thuế', key: 'year', placeholder: 'VD: 2026' },
              { label: 'Số tiền tối thiểu', key: 'amount', placeholder: 'VD: 1000000' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input placeholder={f.placeholder} value={adv[f.key]} onChange={e => setAdv(a => ({ ...a, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Trạng thái</label>
              <select value={adv.status} onChange={e => setAdv(a => ({ ...a, status: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}>
                <option value="">Tất cả</option>
                <option value="UNPAID">Chưa thanh toán</option>
                <option value="PAID">Đã hoàn thành</option>
                <option value="OVERDUE">Quá hạn</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => { setAdv({ name:'', year:'', amount:'', status:'' }); setShowAdv(false); }}
                style={{ padding: '8px 16px', border: 'none', background: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Xóa bộ lọc</button>
              <button onClick={() => setShowAdv(false)}
                style={{ padding: '8px 18px', background: '#c8102e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Áp dụng</button>
            </div>
          </div>
        </div>
      )}
    </LandTaxLayout>
  );
};

export default TaxPage;