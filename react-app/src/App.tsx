import { CheckCircle } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-surface rounded-lg p-8 border border-border shadow-lg">
        <div className="flex items-center justify-center mb-8">
          <CheckCircle className="w-16 h-16 text-success" />
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-4 text-text">
          Tipster Tracker - React Migration
        </h1>
        
        <p className="text-center text-text-secondary mb-8">
          Fase 0: Setup completado exitosamente ✅
        </p>
        
        <div className="space-y-4">
          <div className="bg-background rounded p-4 border border-border-inner">
            <h3 className="text-lg font-semibold text-text mb-2">✨ Tecnologías</h3>
            <ul className="text-text-secondary space-y-1 ml-4">
              <li>• React 19 + TypeScript 5</li>
              <li>• Vite 7</li>
              <li>• Tailwind CSS 4</li>
              <li>• Firebase SDK</li>
              <li>• ESLint + Prettier + Husky</li>
            </ul>
          </div>
          
          <div className="bg-background rounded p-4 border border-border-inner">
            <h3 className="text-lg font-semibold text-text mb-2">🏗️ Arquitectura</h3>
            <ul className="text-text-secondary space-y-1 ml-4">
              <li>• Feature-based structure</li>
              <li>• SOLID principles</li>
              <li>• TypeScript path aliases</li>
              <li>• Shared components & hooks</li>
            </ul>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button className="flex-1 bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded transition-colors">
              Siguiente Fase →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
