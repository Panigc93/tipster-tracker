import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from './ToastContext';
import type { ToastContainerProps, ToastVariant } from './Toast.types';

/**
 * ToastContainer renders all active toasts
 *
 * Should be placed once at the root of your app
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <ToastContainer />
 *       <YourApp />
 *     </ToastProvider>
 *   );
 * }
 * ```
 */
export function ToastContainer({ position = 'top-right' }: ToastContainerProps) {
  const { toasts, removeToast } = useToast();

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  // Variant styles
  const variantClasses: Record<ToastVariant, string> = {
    default: 'bg-slate-800 border-slate-700 text-slate-200',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  // Variant icons
  const icons: Record<ToastVariant, React.ReactNode> = {
    default: <Info className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  if (toasts.length === 0) return null;

  return (
    <div className={`fixed z-50 flex flex-col gap-2 ${positionClasses[position]}`}>
      {toasts.map((toast) => {
        const variant = toast.variant || 'default';
        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
              min-w-[300px] max-w-[500px]
              animate-slide-down
              ${variantClasses[variant]}
            `}
            role="alert"
          >
            {icons[variant]}
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="hover:opacity-70 transition-opacity focus:outline-none"
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
