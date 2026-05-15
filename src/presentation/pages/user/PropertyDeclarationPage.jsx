import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandTaxLayout from '../../components/LandTaxLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';

const API_BASE = 'http://localhost:8080/api';
const getAuth  = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });

const formatDate = (v) => v ? new Date(v).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

// Bổ sung thêm các trạng thái có thể có trong CSDL
// Bổ sung thêm mapping cho các trạng thái trong Database của bạn
const STATUS_CONFIG = {
  PENDING:    { label: 'Chờ duyệt',   bg: '#fef9c3', color: '#ca8a04', icon: 'bi-clock' },
  SUBMITTED:  { label: 'Đã nộp',      bg: '#e0f2fe', color: '#0284c7', icon: 'bi-box-arrow-in-right' }, // Thêm trạng thái này
  'Chờ duyệt': { label: 'Chờ duyệt',   bg: '#fef9c3', color: '#ca8a04', icon: 'bi-clock' }, // Mapping tiếng Việt
  APPROVED:   { label: 'Đã duyệt',    bg: '#dcfce7', color: '#16a34a', icon: 'bi-check-circle' },
  COMPLETED:  { label: 'Hoàn thành',  bg: '#dcfce7', color: '#16a34a', icon: 'bi-check-circle-fill' },
  REJECTED:   { label: 'Bị từ chối',  bg: '#fee2e2', color: '#dc2626', icon: 'bi-x-circle' },
  CANCELLED:  { label: 'Đã hủy',      bg: '#f1f5f9', color: '#64748b', icon: 'bi-slash-circle' },
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
  const { user } = useUserInfo();
  const [declarations, setDeclarations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [tab,          setTab]          = useState('PENDING');

  useEffect(() => { fetchDeclarations(); }, []);

  const fetchDeclarations = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/records/my-records`, {
        headers: getAuth()
      });
      const json = await res.json();
      const raw = Array.isArray(json) ? json : (json.data || []);

      // Chuẩn hóa dữ liệu map chuẩn xác với các trường trong Database
      const formattedData = raw.map(d => ({
        id: d.id || d.record_id || d.recordId,
        type: d.declared_purpose || d.declaredPurpose || d.record_category || d.recordCategory || 'Khai báo thuế đất',
        address: d.address || (d.parcel_id ? `Thửa đất #${d.parcel_id}` : `Thửa đất #${d.parcelId || '—'}`),
        date: d.submitted_at || d.submittedAt || d.created_at || d.createdAt,
        status: d.status || d.current_status || d.currentStatus || 'PENDING'
      }));

      // Sắp xếp hồ sơ mới nhất lên đầu
      formattedData.sort((a, b) => b.id - a.id);
      setDeclarations(formattedData);
    } catch (e) {
      console.error("Lỗi tải lịch sử tờ khai:", e);
    } finally { 
      setLoading(false); 
    }
  };

  const getTabData = () => {
    const q = search.toLowerCase();
    return declarations.filter(d => {
      const matchSearch = !q || d.type.toLowerCase().includes(q) || String(d.id).includes(q) || d.address.toLowerCase().includes(q);
      const s = d.status;
      
      // Gộp các trạng thái từ DB vào đúng Tab hiển thị
      let matchTab = false;
      if (tab === 'PENDING') {
          // Gộp tất cả các trạng thái có ý nghĩa là "Đang chờ"
          matchTab = (s === 'PENDING' || s === 'SUBMITTED' || s === 'Chờ duyệt');
      } else if (tab === 'APPROVED') {
          matchTab = (s === 'APPROVED' || s === 'COMPLETED');
      } else if (tab === 'REJECTED') {
          matchTab = (s === 'REJECTED' || s === 'CANCELLED');
      }
                       
      return matchSearch && matchTab;
    });
  };

  const tabData    = getTabData();
  // Đừng quên đếm lại số lượng cho cái bong bóng thông báo trên tab PENDING
  const pendingCount = declarations.filter(d => d.status === 'PENDING' || d.status === 'SUBMITTED' || d.status === 'Chờ duyệt').length;

  return (
    <LandTaxLayout user={user}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 26, color: '#0f172a', margin: 0 }}>Hồ sơ khai báo</h3>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Quản lý và theo dõi hồ sơ đất đai của bạn</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm mã hồ sơ, tên hồ sơ, địa chỉ..."
              style={{ padding: '9px 14px 9px 36px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', width: 280 }} />
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
            <p style={{ marginTop: 12, fontSize: 13 }}>Không có hồ sơ nào khớp với bộ lọc</p>
          </div>
        ) : (
          tabData.map((d, i) => (
            <div key={d.id || i} style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1.5fr 1.5fr', borderBottom: i < tabData.length - 1 ? '1px solid #f1f5f9' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ padding: '16px' }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', margin: 0 }}>{d.type}</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0' }}>{d.id ? `HS-${String(d.id).padStart(5,'0')}` : '—'}</p>
              </div>
              <div style={{ padding: '16px', color: '#475569', fontSize: 13, display: 'flex', alignItems: 'center' }}>{d.address}</div>
              <div style={{ padding: '16px', color: '#475569', fontSize: 13, display: 'flex', alignItems: 'center' }}>{formatDate(d.date)}</div>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}><StatusBadge status={d.status} /></div>
            </div>
          ))
        )}
      </div>
    </LandTaxLayout>
  );
};

export default PropertyDeclarationPage;