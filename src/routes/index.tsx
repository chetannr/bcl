import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { MatchSchedule } from '../components/schedule/MatchSchedule';
import { TeamsTab } from '../components/schedule/TeamsTab';
import { StandingsTab } from '../components/schedule/StandingsTab';

export const Route = createFileRoute('/')({
  component: SchedulePage,
});

type Tab = 'matches' | 'teams' | 'standings';
type Theme = 'dark' | 'light';

function SchedulePage() {
  const [activeTab, setActiveTab] = useState<Tab>('matches');
  const [theme, setTheme] = useState<Theme>('dark');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'matches', label: 'MATCHES' },
    { id: 'teams', label: 'TEAMS' },
    { id: 'standings', label: 'STANDINGS' },
  ];

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-b px-4 py-4`}>
          <div className="flex items-center justify-between mb-2">
            <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              BCL 2025
            </h1>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Bellandur Cricket League
          </p>
        </div>

        {/* Tabs */}
        <div className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-b`}>
          <nav className="flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-3 px-4 text-center text-sm font-medium transition-colors relative
                  ${
                    activeTab === tab.id
                      ? isDark
                        ? 'text-white'
                        : 'text-neutral-900'
                      : isDark
                        ? 'text-neutral-400 hover:text-neutral-300'
                        : 'text-neutral-600 hover:text-neutral-900'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-white' : 'bg-neutral-900'}`} />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4">
          {activeTab === 'matches' && <MatchSchedule theme={theme} />}
          {activeTab === 'teams' && <TeamsTab theme={theme} />}
          {activeTab === 'standings' && <StandingsTab theme={theme} />}
        </div>
      </div>
    </div>
  );
}
