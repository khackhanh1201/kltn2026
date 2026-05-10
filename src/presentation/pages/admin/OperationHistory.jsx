import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const OperationHistory = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');

  // States quản lý dữ liệu
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States quản lý bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('Tất cả hành động');
  const [dateFilter, setDateFilter] = useState('');

  // Lấy dữ liệu khi vào trang
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = 'http://localhost:8080'; // Thay bằng port backend của bạn
      
      const res = await fetch(`${baseUrl}/api/admin/audit-logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Không thể tải dữ liệu lịch sử thao tác');

      const data = await res.json();
      const rawLogs = data.data || data;

      if (Array.isArray(rawLogs)) {
        // Map dữ liệu từ DB (Bảng audit_logs) sang format hiển thị
        const mappedLogs = rawLogs.map(log => {
          // Xử lý status dựa trên action (vd: REJECT = LỖI/Từ chối, còn lại là TỐT/Thành công)
          const actionStr = (log.action || '').toUpperCase();
          const isError = actionStr.includes('REJECT') || actionStr.includes('FAIL') || actionStr.includes('ERROR');

          // Định dạng thời gian
          const logDate = log.timestamp ? new Date(log.timestamp) : null;
          const formattedTime = logDate 
            ? logDate.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
            : '';

          // Format target (Ghép target_type và target_id)
          const targetStr = [log.target_type || log.targetType, log.target_id || log.targetId].filter(Boolean).join(' / ');

          return {
            id: log.id,
            time: formattedTime,
            rawDate: logDate ? logDate.toISOString().split('T')[0] : '', // Dùng để lọc ngày
            accountName: log.fullName || 'Hệ thống / Ẩn danh', // Backend có thể join thêm fullName, nếu ko có thì mặc định
            accountId: log.user_cccd || log.userCccd || 'N/A',
            ip: log.ip_address || log.ipAddress || 'Không xác định',
            actionType: log.action || 'KHÔNG RÕ',
            target: targetStr || 'Hệ thống chung',
            detail: log.description || '',
            status: isError ? 'LỖI' : 'TỐT'
          };
        });

        // Sắp xếp mới nhất lên đầu
        mappedLogs.sort((a, b) => b.id - a.id);
        setLogs(mappedLogs);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Logic Lọc dữ liệu
  const filteredLogs = logs.filter(log => {
    // 1. Lọc theo text (Tìm kiếm ID log, CCCD, IP, Tên)
    const matchSearch = 
      log.id.toString().includes(searchTerm) || 
      log.accountId.includes(searchTerm) || 
      log.ip.includes(searchTerm) ||
      log.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Lọc theo Action
    const matchAction = actionFilter === 'Tất cả hành động' || log.actionType === actionFilter;
    
    // 3. Lọc theo Ngày
    const matchDate = !dateFilter || log.rawDate === dateFilter;

    return matchSearch && matchAction && matchDate;
  });

  // Lấy danh sách các loại thao tác duy nhất để hiển thị vào thẻ select (Dropdown)
  const uniqueActions = [...new Set(logs.map(log => log.actionType))];

  // Hàm xuất CSV
  const handleExportCSV = () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = 'http://localhost:8080';
      window.open(`${baseUrl}/api/admin/reports/export?reportType=AUDIT_LOGS&format=csv&token=${token}`, '_blank');
    } catch (err) {
      alert("Lỗi khi xuất dữ liệu");
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="container py-4" style={{ maxWidth: '1140px' }}>
        
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h3 className="fw-bold mb-1">Lịch sử thao tác</h3>
            <p className="text-muted small mb-0">Tra cứu và kiểm toán các hành động trên hệ thống (Audit Logs)</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-light border fw-semibold px-3 py-2 shadow-sm" onClick={fetchAuditLogs}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
            <button 
              className="btn btn-outline-secondary fw-semibold px-4 py-2 d-flex align-items-center gap-2 shadow-sm" 
              style={{ borderRadius: '8px' }}
              onClick={handleExportCSV}
            >
              <i className="bi bi-download"></i> Xuất dữ liệu (CSV)
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Filter Bar */}
        <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              {/* Search */}
              <div className="col-12 col-lg-5 position-relative">
                <i className="bi bi-search position-absolute text-muted" style={{ left: '25px', top: '50%', transform: 'translateY(-50%)' }}></i>
                <input 
                  type="text" 
                  className="form-control py-2 bg-light border-0" 
                  placeholder="Tra cứu ID Log, CCCD, IP..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px', borderRadius: '8px' }}
                />
              </div>
              
              {/* Action Filter */}
              <div className="col-12 col-md-4 col-lg-4">
                <select 
                  className="form-select py-2 bg-light border-0 fw-semibold text-secondary" 
                  value={actionFilter} 
                  onChange={(e) => setActionFilter(e.target.value)} 
                  style={{ borderRadius: '8px' }}
                >
                  <option value="Tất cả hành động">Tất cả hành động</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="col-12 col-md-4 col-lg-3">
                <input 
                  type="date" 
                  className="form-control py-2 bg-light border-0 text-secondary fw-semibold" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <div className="mt-3 text-muted small">Đang lấy dữ liệu log...</div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-borderless table-hover align-middle mb-0" style={{ minWidth: '900px' }}>
                <thead className="bg-light border-bottom">
                  <tr>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>THỜI GIAN</th>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>TÀI KHOẢN (NGƯỜI XỬ LÝ)</th>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>LOẠI THAO TÁC</th>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>ĐỐI TƯỢNG TÁC ĐỘNG</th>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>CHI TIẾT</th>
                    <th className="py-3 px-4 text-muted small fw-bold text-end" style={{ letterSpacing: '0.5px' }}>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={log.id} className={index !== filteredLogs.length - 1 ? "border-bottom" : ""}>
                      <td className="py-3 px-4 text-muted small text-nowrap">
                        <div className="fw-semibold text-dark">{log.time.split(' ')[1]}</div>
                        <div className="small">{log.time.split(' ')[0]}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="fw-bold text-dark">{log.accountName}</div>
                        <div className="text-muted small mt-1 font-monospace">
                          {log.accountId} <span className="mx-1">•</span> IP: {log.ip}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                          {log.actionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-secondary small fw-semibold font-monospace">
                        {log.target}
                      </td>
                      <td className="py-3 px-4 text-secondary small" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={log.detail}>
                        {log.detail || '-'}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <span className={`badge rounded-pill px-3 py-2 ${log.status === 'TỐT' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                          {log.status === 'TỐT' ? 'Thành công' : 'Lỗi/Từ chối'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-3 text-secondary opacity-50"></i>
                        Không tìm thấy nhật ký thao tác nào phù hợp với bộ lọc
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default OperationHistory;