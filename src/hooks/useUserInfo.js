import { useState, useEffect } from 'react';

export const useUserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Sync từ VNeID
      await fetch('http://localhost:8080/api/profile/sync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => null);

      // Lấy profile
      const res = await fetch('http://localhost:8080/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser({
          fullName: userData.fullName || userData.name || 'Người dùng',
          citizenId: userData.cccdNumber || userData.citizenId,
          phone: userData.phone || userData.phoneNumber,
          email: userData.email,
          address: userData.address || userData.provinceCity,
          dob: userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString('vi-VN') : '',
          avatarInitial: (userData.fullName || 'U')[0].toUpperCase(),
        });
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      // Fallback to localStorage
      const stored = JSON.parse(localStorage.getItem('user_info') || '{}');
      setUser(stored?.data || stored);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading };
};