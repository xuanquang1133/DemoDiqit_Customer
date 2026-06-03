'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, fetchUser, _hasHydrated } = useAuthStore();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!token) {
      router.push('/login?redirect=/profile');
    } else if (!user) {
      fetchUser();
    }
  }, [_hasHydrated, token, user, fetchUser, router]);

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
    router.push('/');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!passwordData.current_password) errors.current_password = 'Vui lòng nhập mật khẩu hiện tại';
    if (!passwordData.new_password) {
      errors.new_password = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.new_password.length < 6) {
      errors.new_password = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }
    if (!passwordData.confirm_password) {
      errors.confirm_password = 'Vui lòng nhập lại mật khẩu mới';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = 'Mật khẩu nhập lại không khớp';
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setIsChangingPassword(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Đổi mật khẩu thất bại');
      setIsChangingPassword(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
      passwordErrors[field]
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400'
    }`;

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-[80px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-[80px] max-w-3xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tài khoản của tôi</h1>

        {/* User Info */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-6">
          <div className="bg-black text-white px-6 py-4">
            <h2 className="font-semibold text-sm">Thông tin tài khoản</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">{user.full_name || user.username}</p>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tài khoản</label>
                <p className="text-sm font-medium text-gray-800 bg-gray-50 px-4 py-2.5 rounded-xl border">
                  {user.username}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <p className="text-sm font-medium text-gray-800 bg-gray-50 px-4 py-2.5 rounded-xl border">
                  {user.email}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Họ và tên</label>
                <p className="text-sm font-medium text-gray-800 bg-gray-50 px-4 py-2.5 rounded-xl border">
                  {user.full_name || '—'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Vai trò</label>
                <p className="text-sm font-medium text-gray-800 bg-gray-50 px-4 py-2.5 rounded-xl border capitalize">
                  {user.roles.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-6">
          <div className="bg-black text-white px-6 py-4">
            <h2 className="font-semibold text-sm">Đổi mật khẩu</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => {
                  setPasswordData((p) => ({ ...p, current_password: e.target.value }));
                  if (passwordErrors.current_password) setPasswordErrors((p) => ({ ...p, current_password: '' }));
                }}
                placeholder="Nhập mật khẩu hiện tại"
                className={inputClass('current_password')}
              />
              {passwordErrors.current_password && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => {
                  setPasswordData((p) => ({ ...p, new_password: e.target.value }));
                  if (passwordErrors.new_password) setPasswordErrors((p) => ({ ...p, new_password: '' }));
                }}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                className={inputClass('new_password')}
              />
              {passwordErrors.new_password && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.new_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nhập lại mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => {
                  setPasswordData((p) => ({ ...p, confirm_password: e.target.value }));
                  if (passwordErrors.confirm_password) setPasswordErrors((p) => ({ ...p, confirm_password: '' }));
                }}
                placeholder="Nhập lại mật khẩu mới"
                className={inputClass('confirm_password')}
              />
              {passwordErrors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm_password}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="font-semibold text-gray-800 mb-2">Đăng xuất</h2>
            <p className="text-sm text-gray-500 mb-4">Bạn sẽ cần đăng nhập lại để sử dụng tài khoản.</p>
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-red-300 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
