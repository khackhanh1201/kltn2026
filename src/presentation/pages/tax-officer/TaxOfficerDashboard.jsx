import React from 'react';
import LandTaxLayout from '../../components/TaxOfficerLayout';
import { useUserInfo } from '../../../hooks/useUserInfo';


const TaxOfficerDashboard = () => {
  const { user } = useUserInfo();

  return (
    <LandTaxLayout user={user}>
      <div style={{ padding: '20px 30px' }}>
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>Bảng điều khiển</h2>
          <p style={{ color: '#64748b', margin: '4px 0 0' }}>
            Theo dõi tình trạng hồ sơ và công việc của bạn
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

          {/* Trạng thái hồ sơ - Card lớn màu đỏ */}
          <div style={{
            background: '#a30d11',
            color: '#fff',
            borderRadius: 16,
            padding: '28px 32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ marginBottom: 20 }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Trạng thái hồ sơ</h5>
              <p style={{ margin: '6px 0 0', opacity: 0.9 }}>Tổng số hồ sơ: 1,284</p>
            </div>

            {/* Donut Chart */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 30px' }}>
              <div style={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: 'conic-gradient(#22c55e 0% 85%, #eab308 85% 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: 110,
                  height: 110,
                  background: '#a30d11',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontSize: 42, fontWeight: 800 }}>85%</div>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>ĐÃ DUYỆT</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>1,150</span>
                </div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>ĐÃ DUYỆT</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#3b82f6', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>42</span>
                </div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>ĐANG XỬ LÝ</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#eab308', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>92</span>
                </div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>CẦN BỔ SUNG</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>0</span>
                </div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>TRỄ HẠN</div>
              </div>
            </div>
          </div>

          {/* Cần xử lý ngay */}
          <div style={{
            background: '#fff',
            border: '1px solid #fee2e2',
            borderRadius: 16,
            padding: '24px 28px',
            height: 'fit-content'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#fee2e2', color: '#ef4444', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ⚠️
              </div>
              <div>
                <strong style={{ color: '#ef4444' }}>Cần xử lý ngay</strong>
                <div style={{ fontSize: 13, color: '#ef4444' }}>Ưu tiên cao</div>
              </div>
            </div>

            <div style={{ fontSize: 48, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>42</div>
            <div style={{ fontSize: 18, color: '#ef4444', marginBottom: 24 }}>hồ sơ</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Hồ sơ mới tiếp nhận</span>
                <strong>12</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Hồ sơ quá hạn xử lý</span>
                <strong>5</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569' }}>Yêu cầu giải trình</span>
                <strong style={{ color: '#ef4444' }}>25</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div style={{ marginTop: 40 }}>
          <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Hoạt động gần đây</h5>

          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 600, display: 'flex' }}>
              <div style={{ flex: 1 }}>MÃ HỒ SƠ/KHIẾU NẠI</div>
              <div style={{ flex: 1 }}>NGÀY THÁNG</div>
              <div style={{ flex: 2 }}>NỘI DUNG</div>
              <div style={{ flex: 1, textAlign: 'center' }}>TRẠNG THÁI</div>
            </div>

            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex' }}>
              <div style={{ flex: 1, fontWeight: 600 }}>HS-2026-001</div>
              <div style={{ flex: 1, color: '#64748b' }}>26/03/2026</div>
              <div style={{ flex: 2, color: '#475569' }}>Hồ sơ khai thuế chuyển nhượng QSDĐ - Nguyễn Văn A</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ background: '#fef9c3', color: '#ca8a04', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Chờ duyệt</span>
              </div>
            </div>

            <div style={{ padding: '18px 24px', display: 'flex' }}>
              <div style={{ flex: 1, fontWeight: 600 }}>HS-2026-002</div>
              <div style={{ flex: 1, color: '#64748b' }}>25/03/2026</div>
              <div style={{ flex: 2, color: '#475569' }}>Hồ sơ khai thuế tặng cho - Lê Thị B</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ background: '#dbeafe', color: '#3b82f6', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Đang kiểm tra</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandTaxLayout>
  );
};

export default TaxOfficerDashboard;