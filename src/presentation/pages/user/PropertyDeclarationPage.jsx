import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';
import { userApi } from '../../../infrastructure/api/userApi';

const formatDate = (v) => v ? new Date(v).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const STATUS_CONFIG = {
  PENDING:  { label: 'Chờ duyệt',  bg: '#fef9c3', color: '#ca8a04', icon: 'bi-clock' },
  APPROVED: { label: 'Đã duyệt',   bg: '#dcfce7', color: '#16a34a', icon: 'bi-check-circle' },
  REJECTED: { label: 'Bị từ chối', bg: '#fee2e2', color: '#dc2626', icon: 'bi-x-circle' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: '#f3f4f6', color: '#6b7280', icon: 'bi-circle' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.color }}>
      <i className={`bi ${cfg.icon}`} style={{ fontSize: 12 }} /> {cfg.label}
    </span>
  );
};

const TABS = [
  { key: 'PENDING',  label: 'Chờ xử lý' },
  { key: 'APPROVED', label: 'Đã duyệt' },
  { key: 'REJECTED', label: 'Bị từ chối' },
];

const PropertyDeclarationPage = () => {
  const navigate = useNavigate();
  const [declarations, setDeclarations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [tab,          setTab]          = useState('PENDING');

  useEffect(() => { fetchDeclarations(); }, []);

  const fetchDeclarations = async () => {
    setLoading(true);
    try {
      const list = await userApi.getMyDeclarations();
      setDeclarations(list);
    } catch {}
    finally { setLoading(false); }
  };

  const getTabData = () => {
    const q = search.toLowerCase();
    return declarations.filter(d => {
      const matchSearch = !q || (d.declarationType||d.type||'').toLowerCase().includes(q) || String(d.recordId ||'').includes(q);
      const status = d.status || 'PENDING';
      const matchTab = tab === 'PENDING'  ? status === 'PENDING' :
                       tab === 'APPROVED' ? status === 'APPROVED' :
                       status === 'REJECTED';
      return matchSearch && matchTab;
    });
  };

  const getLabel   = (d) => d.declaredPurpose || 'Khai báo thuế đất';
  const getAsset   = (d) => d.address || d.parcelAddress || `Thửa đất tại ${d.parcelId || '—'}`;
  const getCode = (d) =>
  d.recordId
    ? `HS-${String(d.recordId).padStart(5,'0')}`
    : '—';
  const tabData    = getTabData();
  const pendingCount = declarations.filter(d => (d.status||'PENDING') === 'PENDING').length;

  return (
    <LandTaxLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 26, color: '#0f172a', margin: 0 }}>Hồ sơ khai báo</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Quản lý và theo dõi hồ sơ đất đai của bạn</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm mã hồ sơ, tên hồ sơ..."
              style={{ padding: '9px 14px 9px 36px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', width: 260 }} />
          </div>
          <button onClick={() => navigate('/submit-declaration')}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#c8102e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <i className="bi bi-file-earmark-plus" /> Tạo hồ sơ
          </button>
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? '#c8102e' : '#64748b',
              borderBottom: tab === t.key ? '2px solid #c8102e' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {t.label}
              {t.key === 'PENDING' && pendingCount > 0 && (
                <span style={{ background: '#c8102e', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1.5fr 1.5fr', gap: 0, background: '#fafafa', borderBottom: '1px solid #e2e8f0' }}>
          {['LOẠI THỦ TỤC', 'TÀI SẢN LIÊN QUAN', 'NGÀY NỘP', 'TRẠNG THÁI'].map(h => (
            <div key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em' }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            <div className="spinner-border text-danger" role="status" />
          </div>
        ) : tabData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            <i className="bi bi-inbox" style={{ fontSize: 36 }} />
            <p style={{ marginTop: 12, fontSize: 13 }}>Không có hồ sơ nào</p>
          </div>
        ) : (
          tabData.map((d, i) => (
            <div key={d.recordId  || i} style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1.5fr 1.5fr', borderBottom: i < tabData.length - 1 ? '1px solid #f1f5f9' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ padding: '16px' }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: 0 }}>{getLabel(d)}</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0' }}>{getCode(d)}</p>
              </div>
              <div style={{ padding: '16px', color: '#475569', fontSize: 13, display: 'flex', alignItems: 'center' }}>{getAsset(d)}</div>
              <div style={{ padding: '16px', color: '#475569', fontSize: 13, display: 'flex', alignItems: 'center' }}>{formatDate(d.createdAt || d.submittedAt)}</div>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}><StatusBadge status={d.status || 'PENDING'} /></div>
            </div>
          ))
        )}
      </div>
    </LandTaxLayout>
  );
};

export default PropertyDeclarationPage;