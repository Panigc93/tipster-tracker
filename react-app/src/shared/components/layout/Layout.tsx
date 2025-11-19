/**
 * @fileoverview Main application layout with navbar
 * @module shared/components/layout
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, BarChart3, Users, FileText } from 'lucide-react';
import { useAuth } from '@features/auth/hooks';
import { Button } from '../ui';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout with navigation
 */
export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: BarChart3,
    },
    {
      path: '/tipsters',
      label: 'Tipsters',
      icon: Users,
    },
    {
      path: '/picks',
      label: 'Picks',
      icon: FileText,
    },
    {
      path: '/my-picks',
      label: 'Mis Picks',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-slate-100">
                  Tipster Tracker
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user?.email && (
                <span className="text-sm text-slate-400">
                  {user.email}
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="h-4 w-4" />}
              >
                Salir
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
