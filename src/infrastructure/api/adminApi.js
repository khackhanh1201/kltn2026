const API_BASE = 'http://localhost:8080/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

const toArray = (json) => (Array.isArray(json) ? json : json?.data ?? []);

export const adminApi = {
  // ─── Admin Controller (Quản lý User & Hệ thống) ───────────────────────────
  getUsers: () =>
    fetch(`${API_BASE}/admin/users`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  updateUserStatus: (cccd) =>
    fetch(`${API_BASE}/admin/users/${cccd}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateUserRole: (cccd, roleData) =>
    fetch(`${API_BASE}/admin/users/${cccd}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData), // Truyền thông tin vai trò mới
    }).then(handleResponse),

  getDashboardStatistics: () =>
    fetch(`${API_BASE}/admin/statistics/dashboard`, { headers: getAuthHeaders() })
      .then(handleResponse),

  getAuditLogs: () =>
    fetch(`${API_BASE}/admin/audit-logs`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  // ─── Tax Controller (Quản lý Duyệt Hồ Sơ Thuế) ───────────────────────────
  getVerifiedRecords: () =>
    fetch(`${API_BASE}/tax/records/verified`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  approveTaxRecord: (id) =>
    fetch(`${API_BASE}/tax/records/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  rejectTaxRecord: (id, reasonData) =>
    fetch(`${API_BASE}/tax/records/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reasonData), // Truyền lý do từ chối nếu có
    }).then(handleResponse),

  exportTaxData: () =>
    fetch(`${API_BASE}/tax/export/data`, { headers: getAuthHeaders() }),

  getAllTaxBills: () =>
    fetch(`${API_BASE}/tax/bills/all`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  // ─── Record Controller (Quản lý Hồ Sơ Phân Hệ Thừa Đất) ───────────────────
  getAllRecords: () =>
    fetch(`${API_BASE}/records`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  getSubmittedRecords: () =>
    fetch(`${API_BASE}/records/submitted`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  verifyRecord: (id) =>
    fetch(`${API_BASE}/records/${id}/verify`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // ─── Complaint Controller (Quản lý Khiếu Nại) ─────────────────────────────
  getAllComplaints: () =>
    fetch(`${API_BASE}/admin/complaints`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  resolveComplaint: (id, resolveData) =>
    fetch(`${API_BASE}/admin/complaints/${id}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(resolveData), // Truyền nội dung xử lý / phản hồi
    }).then(handleResponse),

  // ─── Land Price Controller (Quản lý Khung Giá Đất) ────────────────────────
  getAllLandPrices: () =>
    fetch(`${API_BASE}/land-prices`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  createLandPrice: (data) =>
    fetch(`${API_BASE}/land-prices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateLandPrice: (id, data) =>
    fetch(`${API_BASE}/land-prices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteLandPrice: (id) =>
    fetch(`${API_BASE}/land-prices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  updateBulkLandPrices: (data) =>
    fetch(`${API_BASE}/land-prices/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // ─── Land Parcel Controller (Quản lý Thừa Đất Tổng Thể) ───────────────────
  getAllLandParcels: () =>
    fetch(`${API_BASE}/land-parcels/all`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  createLandParcel: (data) =>
    fetch(`${API_BASE}/land-parcels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateLandParcel: (id, data) =>
    fetch(`${API_BASE}/land-parcels/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteLandParcel: (id) =>
    fetch(`${API_BASE}/land-parcels/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  importLandParcels: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/land-parcels/import`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    }).then(handleResponse);
  },

  // ─── Mutation Controller (Biến động đất đai) ──────────────────────────────
  approveMutationRequest: (id) =>
    fetch(`${API_BASE}/mutation-requests/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  requestMoreDocsMutation: (id, data) =>
    fetch(`${API_BASE}/mutation-requests/${id}/need-more-docs`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data), // Truyền lý do hoặc danh sách giấy tờ thiếu
    }).then(handleResponse),

  // ─── Payment Reconciliation (Đối soát thanh toán) ────────────────────────
  uploadReconciliationFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/payments/reconcile/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    }).then(handleResponse);
  },

  getReconciliationDiscrepancies: () =>
    fetch(`${API_BASE}/payments/reconcile/discrepancies`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  adjustBill: (id, data) =>
    fetch(`${API_BASE}/api/payments/bills/${id}/adjust`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  exportAdminReports: () =>
    fetch(`${API_BASE}/admin/reports/export`, { headers: getAuthHeaders() }),

  // ─── Master Data & Other Admin Modules ──────────────────────────────────
  createMasterLandType: (data) =>
    fetch(`${API_BASE}/master-data/land-types`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getAdminDelegations: () =>
    fetch(`${API_BASE}/admin/delegations`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  createAdminDelegation: (data) =>
    fetch(`${API_BASE}/admin/delegations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  createAdminExemption: (data) =>
    fetch(`${API_BASE}/admin/exemptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
};