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

export const cadastralApi = {
  // ─── Land Parcels (Quản lý thửa đất) ──────────────────────────────────────
  getAllParcels: () =>
    fetch(`${API_BASE}/land-parcels`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  getParcelById: (id) =>
    fetch(`${API_BASE}/land-parcels/${id}`, { headers: getAuthHeaders() })
      .then(handleResponse),

  createParcel: (data) =>
    fetch(`${API_BASE}/land-parcels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateParcel: (id, data) =>
    fetch(`${API_BASE}/land-parcels/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteParcel: (id) =>
    fetch(`${API_BASE}/land-parcels/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  importParcels: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/land-parcels/import`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    }).then(handleResponse);
  },

  // ─── Mutation Requests (Yêu cầu biến động đất đai) ────────────────────────
  /**
   * TẠO YÊU CẦU BIẾN ĐỘNG MỚI (POST)
   */
  createMutationRequest: (data) =>
    fetch(`${API_BASE}/mutation-requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  /**
   * LẤY DANH SÁCH YÊU CẦU BIẾN ĐỘNG
   */
  getMutationRequests: (status = null) => {
    let url = `${API_BASE}/mutation-requests`;
    if (status) {
      url += `?status=${status.toUpperCase()}`;
    }
    return fetch(url, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray);
  },

  getPendingMutationRequests: () =>
    fetch(`${API_BASE}/mutation-requests?status=PENDING`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  approveMutation: (id) =>
    fetch(`${API_BASE}/mutation-requests/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  requireMoreDocsMutation: (id, reason) =>
    fetch(`${API_BASE}/mutation-requests/${id}/need-more-docs`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    }).then(handleResponse),

  // ─── Tax Records & Declarations ───────────────────────────────────────────
  getPendingRecords: () =>
    fetch(`${API_BASE}/tax/records/verified`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  getDeclarationHistory: () =>
    fetch(`${API_BASE}/tax/declarations/history`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  getDeclarationById: (id) =>
    fetch(`${API_BASE}/tax/declarations/${id}`, { headers: getAuthHeaders() })
      .then(handleResponse),

  approveRecord: (id) =>
    fetch(`${API_BASE}/tax/records/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  rejectRecord: (id) =>
    fetch(`${API_BASE}/tax/records/${id}/verify`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // ─── Land Prices ──────────────────────────────────────────────────────────
  getLandPrices: () =>
    fetch(`${API_BASE}/land-prices`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  createLandPrice: (data) =>
    fetch(`${API_BASE}/land-prices`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  lookupLandPrice: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/lookup?${query}`, { headers: getAuthHeaders() })
      .then(handleResponse);
  },

  // ─── Master Data ──────────────────────────────────────────────────────────
  getLandTypes: () =>
    fetch(`${API_BASE}/master-data/land-types`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  getAreas: () =>
    fetch(`${API_BASE}/master-data/areas`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  // ─── Land History ─────────────────────────────────────────────────────────
  getLandHistory: (id) =>
    fetch(`${API_BASE}/lands/${id}/history`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),

  // ─── Complaints (Khiếu nại) ───────────────────────────────────────────────
  getComplaints: () =>
    fetch(`${API_BASE}/admin/complaints`, { headers: getAuthHeaders() })
      .then(handleResponse)
      .then(toArray),
};

export default cadastralApi;