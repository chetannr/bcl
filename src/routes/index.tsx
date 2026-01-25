import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { MatchSchedule } from '../components/schedule/MatchSchedule';
import { TeamsTab } from '../components/schedule/TeamsTab';
import { StandingsTab } from '../components/schedule/StandingsTab';
import { PredictionTab } from '../components/schedule/PredictionTab';
import { useSEO, useStructuredData, generateBreadcrumbSchema } from '../lib/seo';

export const Route = createFileRoute('/')({
  component: SchedulePage,
});

type Tab = 'matches' | 'teams' | 'standings' | 'predictions';
type Theme = 'dark' | 'light';

function SchedulePage() {
  const [activeTab, setActiveTab] = useState<Tab>('matches');
  const [theme, setTheme] = useState<Theme>('dark');
  const tabListRef = useRef<HTMLDivElement>(null);

  // SEO Configuration
  useSEO({
    title: 'Match Schedule & Standings',
    description: 'View the complete BCL 2025 match schedule, team standings, and tournament information. Track your favorite teams and upcoming matches.',
    keywords: 'BCL schedule, cricket matches, team standings, tournament schedule, cricket league standings',
    url: 'https://bclclub.in/',
    type: 'website',
  });

  // Structured Data - Breadcrumbs
  useStructuredData(
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: activeTab === 'matches' ? 'Matches' : activeTab === 'teams' ? 'Teams' : activeTab === 'standings' ? 'Standings' : 'Predictions', url: '/' },
    ]),
    'breadcrumb-schema'
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: 'matches', label: 'MATCHES' },
    { id: 'teams', label: 'TEAMS' },
    { id: 'standings', label: 'STANDINGS' },
    { id: 'predictions', label: 'PREDICTIONS' },
  ];

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  // Auto-scroll to active tab when it changes
  useEffect(() => {
    if (tabListRef.current) {
      const activeTabElement = tabListRef.current.querySelector(`#${activeTab}-tab`) as HTMLElement;
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTab]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-b px-4 py-4`}>
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
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              aria-pressed={isDark}
              type="button"
            >
              {isDark ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
          <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Bellandur Cricket League
          </p>
        </header>

        {/* Tabs */}
        <nav 
          className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} border-b overflow-x-auto scroll-smooth`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex" role="tablist" ref={tabListRef}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`
                  flex-shrink-0 py-3 px-4 text-center text-sm font-medium transition-colors relative whitespace-nowrap
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
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-white' : 'bg-neutral-900'}`} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <main className="px-4 py-4">
          <div
            role="tabpanel"
            id="matches-panel"
            aria-labelledby="matches-tab"
            hidden={activeTab !== 'matches'}
          >
            {activeTab === 'matches' && <MatchSchedule theme={theme} />}
          </div>
          <div
            role="tabpanel"
            id="teams-panel"
            aria-labelledby="teams-tab"
            hidden={activeTab !== 'teams'}
          >
            {activeTab === 'teams' && <TeamsTab theme={theme} />}
          </div>
          <div
            role="tabpanel"
            id="standings-panel"
            aria-labelledby="standings-tab"
            hidden={activeTab !== 'standings'}
          >
            {activeTab === 'standings' && <StandingsTab theme={theme} />}
          </div>
          <div
            role="tabpanel"
            id="predictions-panel"
            aria-labelledby="predictions-tab"
            hidden={activeTab !== 'predictions'}
          >
            {activeTab === 'predictions' && <PredictionTab theme={theme} />}
          </div>
        </main>
      </div>
    </div>
  );
}
