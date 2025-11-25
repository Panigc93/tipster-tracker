/**
 * @fileoverview Header component - Main application header with logo, navigation, and actions
 * @module shared/components/layout/Header
 */

import { Link, useLocation } from 'react-router-dom';
import { LogOut, Plus, UserPlus } from 'lucide-react';
import { useAuth } from '@features/auth/hooks';
import logoSvg from '@/assets/logo-filled-text.svg';

interface HeaderProps {
  readonly onAddTipster: () => void;
  readonly onAddPick: () => void;
}

export function Header({ onAddTipster, onAddPick }: Readonly<HeaderProps>) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/picks', label: 'Todas las Picks' },
    { path: '/my-picks', label: 'Mis Picks' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-slate-800 sticky top-0 z-50">
      <div className="mx-auto px-8 py-3 flex items-center justify-between border-b border-slate-700 max-w-7xl">
            <Link to="/" className="flex items-center">
              <img 
                src={logoSvg} 
                alt="Tipster Tracker" 
                className="h-10"
              />
            </Link>
            <div className="hidden md:flex items-center gap-3">
              {user?.email && (
                <span className="text-sm text-slate-200 bg-slate-700 py-1 px-4 rounded-full">
                  {user.email}
                </span>
              )}

              <button
                onClick={onAddTipster}
                className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-blue-600 text-white text-sm font-medium rounded-sm hover:bg-slate-900 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Añadir Tipster</span>
              </button>

              <button
                onClick={onAddPick}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Añadir Pick</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-1 text-red-500 bg-red-500/20 border border-red-500 rounded-sm hover:bg-red-500/30 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
      </div>

      <div className="hidden md:block bg-slate-900">
        <div className="max-w-7xl mx-auto px-5">
          <nav className="flex w-full justify-end">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    px-4 py-2 text-sm font-medium transition-colors border-b-2
                    ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
