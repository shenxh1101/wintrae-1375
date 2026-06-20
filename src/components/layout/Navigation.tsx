import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, FlaskConical, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const navItems = [
  { path: '/', label: '关卡选择', icon: Home, color: 'from-cyan-400 to-blue-500' },
  { path: '/stats', label: '成绩统计', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
  { path: '/hint-lab', label: '提示实验室', icon: FlaskConical, color: 'from-green-400 to-emerald-500' },
  { path: '/mistakes', label: '错题本', icon: XCircle, color: 'from-red-400 to-rose-500' },
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      'fixed left-0 top-16 bottom-0 z-30 transition-all duration-300',
      collapsed ? 'w-20' : 'w-64',
      className
    )}>
      <div className="h-full bg-slate-900/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
        <div className="flex-1 py-6 px-3 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
                  isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="text-sm">收起</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
