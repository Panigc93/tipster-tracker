/**
 * Temporary dashboard component placeholder
 * TODO: Replace with real Dashboard from Phase 7
 */
export function DashboardPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-100 mb-4">Dashboard</h1>
        <p className="text-slate-400 mb-4">Coming soon in Phase 7...</p>
        <button
          onClick={() => {
            // TODO: Implement logout
            console.log('Logout clicked');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
