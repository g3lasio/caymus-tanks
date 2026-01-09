import { Shield, Lock } from "lucide-react";

export default function RestrictedAccess() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 p-4">
        <div className="text-center max-w-lg">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-full p-8">
              <Shield className="w-20 h-20 text-cyan-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Acceso Restringido
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-slate-400" />
            <p className="text-slate-400 text-lg">
              Plataforma Web App con acceso restringido
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-semibold text-white">Acceso por Seguridad</span>
            </div>
            <p className="text-slate-300">
              El acceso a esta plataforma está restringido por cuestiones de seguridad. Solo usuarios autorizados pueden acceder al sistema.
            </p>
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-50" />
                <div className="relative bg-slate-900 p-2 rounded-lg border border-slate-700/50">
                  <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Chyrris Technologies Inc
                </h2>
                <p className="text-xs text-slate-500">Innovating the Future</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-slate-500 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                Sistema Activo
              </span>
              <span>&copy; {new Date().getFullYear()} Todos los derechos reservados</span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>
      </footer>
    </div>
  );
}
