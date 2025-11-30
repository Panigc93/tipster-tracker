/**
 * @fileoverview Main application layout with header and mobile sidebar
 * @module shared/components/layout
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, BarChart3, FileText, Menu, X, Plus, UserPlus } from 'lucide-react';
import { useAuth } from '@features/auth/hooks';
import { AddPickModal } from '@features/picks/components';
import { AddTipsterModal } from '@features/tipsters/components';
import { useTipsters } from '@features/tipsters/hooks';
import { Button } from '../ui';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout with navigation
 */
export function Layout({ children }: Readonly<LayoutProps>) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { tipsters, createTipster } = useTipsters();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAddPickModalOpen, setIsAddPickModalOpen] = useState(false);
  const [isAddTipsterModalOpen, setIsAddTipsterModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAddTipster = () => {
    setIsAddTipsterModalOpen(true);
  };

  const navItems = [
    {
      path: '/',
      label: 'Mis Tipsters',
      icon: BarChart3,
    },
    {
      path: '/picks',
      label: 'Tipsters Picks',
      icon: FileText,
    },
    {
      path: '/my-picks',
      label: 'Mis Picks',
      icon: FileText,
    },
  ];

  // Handle mounting and animation
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Mount first
      setIsMounted(true);
      // Trigger animation after a tiny delay
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      // Start closing animation
      setIsAnimating(false);
      // Unmount after animation completes
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isMobileMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="hidden md:block">
        <Header 
          onAddTipster={handleAddTipster}
          onAddPick={() => setIsAddPickModalOpen(true)}
        />
      </div>

      <div className="md:hidden bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-slate-100">
              Tipster Tracker
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddTipster}
              className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded transition-colors"
              title="Añadir Tipster"
            >
              <UserPlus className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsAddPickModalOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded transition-colors"
              title="Añadir Pick"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMounted && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className={`
              fixed inset-y-0 left-0 w-68 bg-slate-800 border-r border-slate-700 z-50 md:hidden
              transform transition-transform duration-300 ease-in-out
              ${isAnimating ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold text-slate-100">Menu</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="py-4 px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Info & Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-800">
              {user?.email && (
                <p className="text-xs text-slate-400 mb-3 truncate">
                  {user.email}
                </p>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="h-4 w-4" />}
                className="w-full"
              >
                Salir
              </Button>
            </div>
          </div>
        </>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {children}
      </main>

      <AddPickModal
        isOpen={isAddPickModalOpen}
        onClose={() => setIsAddPickModalOpen(false)}
        onSuccess={() => setIsAddPickModalOpen(false)}
        tipsters={tipsters}
      />

      <AddTipsterModal
        isOpen={isAddTipsterModalOpen}
        onClose={() => setIsAddTipsterModalOpen(false)}
        onCreate={async (data) => {
          await createTipster(data);
        }}
        onSuccess={() => setIsAddTipsterModalOpen(false)}
      />
    </div>
  );
}
