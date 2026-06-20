import { Link, useLocation } from 'react-router-dom';
import { FlaskConical, Trophy, BookOpen, XCircle, Home } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';

const navItems = [
  { path: '/', label: '关卡', icon: Home },
  { path: '/stats', label: '成绩', icon: Trophy },
  { path: '/hint-lab', label: '实验室', icon: FlaskConical },
  { path: '/mistakes', label: '错题本', icon: XCircle },
];

export function Header() {
  const location = useLocation();
  const { progress } = useProgressStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">化学配平大师</h1>
              <p className="text-xs text-white/50">Chemistry Balance Master</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-cyan-400 bg-cyan-400/10' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-cyan-400">
                {progress.totalScore.toLocaleString()} 分
              </p>
              <p className="text-xs text-white/50">
                连对 {progress.currentStreak} · 最高 {progress.maxStreak}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
