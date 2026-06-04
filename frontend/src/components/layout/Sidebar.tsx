/**
 * Sidebar component
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { USER_ROLES } from '@/lib/constants';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊', roles: Object.values(USER_ROLES) },
  { label: 'Branches', href: '/branches', icon: '🏢', roles: [USER_ROLES.CEO_ADMIN, USER_ROLES.OPERATIONS_MANAGER] },
  { label: 'Clients', href: '/clients', icon: '👥', roles: Object.values(USER_ROLES) },
  { label: 'Loans', href: '/loans', icon: '💰', roles: Object.values(USER_ROLES) },
  { label: 'Repayments', href: '/repayments', icon: '💳', roles: Object.values(USER_ROLES) },
  { label: 'Collections', href: '/collections', icon: '📈', roles: [USER_ROLES.COLLECTION_OFFICER, USER_ROLES.BRANCH_MANAGER, USER_ROLES.CEO_ADMIN] },
  { label: 'Reports', href: '/reports', icon: '📄', roles: Object.values(USER_ROLES) },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const visibleItems = menuItems.filter((item) => item.roles.includes(user?.role as any));

  return (
    <aside className="w-64 bg-primary-900 text-white flex flex-col">
      <div className="p-6 border-b border-primary-800">
        <h2 className="text-xl font-bold">BUPEK</h2>
        <p className="text-primary-200 text-sm mt-1">Microfinance System</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-primary-600 text-white'
                : 'text-primary-100 hover:bg-primary-800'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-primary-800">
        <div className="text-sm text-primary-200">
          <p className="font-medium">{user?.first_name}</p>
          <p className="text-primary-300 text-xs">{user?.role}</p>
        </div>
      </div>
    </aside>
  );
}
