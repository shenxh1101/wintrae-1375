import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { LevelSelect } from './pages/LevelSelect';
import { Challenge } from './pages/Challenge';
import { HintLab } from './pages/HintLab';
import { Mistakes } from './pages/Mistakes';
import { Stats } from './pages/Stats';
import { useProgressStore } from './store/useProgressStore';
import { useMistakesStore } from './store/useMistakesStore';

export default function App() {
  const { loadProgress } = useProgressStore();
  const { loadMistakes } = useMistakesStore();

  useEffect(() => {
    loadProgress();
    loadMistakes();
  }, [loadProgress, loadMistakes]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <Header />
        <Navigation />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<LevelSelect />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/hint-lab" element={<HintLab />} />
            <Route path="/mistakes" element={<Mistakes />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
