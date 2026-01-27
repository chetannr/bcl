import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Settings, Monitor, Home } from 'lucide-react';
import { useSEO, useStructuredData, generateBreadcrumbSchema } from '../lib/seo';

export const Route = createFileRoute('/home')({
  component: HomePage,
});

function HomePage() {
  console.log('[Route: /home] Landing page component rendered');
  const navigate = useNavigate();

  // SEO Configuration
  useSEO({
    title: 'Auction Management System',
    description: 'BCL 2026 Professional cricket auction management system. Access admin controls, display views, and post-auction management tools.',
    keywords: 'cricket auction, bidding system, team management, player auction, BCL admin',
    url: 'https://bclclub.in/home',
    type: 'website',
  });

  // Structured Data - Breadcrumbs
  useStructuredData(
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Auction System', url: '/home' },
    ]),
    'breadcrumb-schema'
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-neutral-50 flex items-center justify-center p-4">
      <main className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8 md:p-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-neutral-900">
            BCL 2026
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-600 mb-4">
            Bidding System
          </h2>
          <p className="text-neutral-500">
            Professional cricket auction management
          </p>
        </header>
        
        <nav className="space-y-4" aria-label="Main navigation">
          <button
            onClick={() => {
              console.log('[Route: /home] Navigating to /admin/auction');
              navigate({ to: '/admin/auction' });
            }}
            className="w-full bg-primary-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-3 text-lg shadow-md"
            aria-label="Navigate to Admin Control Panel"
          >
            <Settings className="w-6 h-6" aria-hidden="true" />
            <span>Admin Control Panel</span>
          </button>
          
          <button
            onClick={() => {
              console.log('[Route: /home] Navigating to /display');
              navigate({ to: '/display' });
            }}
            className="w-full bg-success-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-success-600 transition-colors flex items-center justify-center gap-3 text-lg shadow-md"
            aria-label="Navigate to Display View for full screen presentation"
          >
            <Monitor className="w-6 h-6" aria-hidden="true" />
            <span>Display View (Full Screen)</span>
          </button>
          
          <button
            onClick={() => {
              console.log('[Route: /home] Navigating to /admin/manage');
              navigate({ to: '/admin/manage' });
            }}
            className="w-full bg-neutral-200 text-neutral-700 py-4 px-6 rounded-lg font-semibold hover:bg-neutral-300 transition-colors flex items-center justify-center gap-3 text-lg"
            aria-label="Navigate to Post-Auction Management"
          >
            <Home className="w-6 h-6" aria-hidden="true" />
            <span>Post-Auction Management</span>
          </button>
        </nav>

        <footer className="mt-8 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-500">
          <p>12 Teams • ₹1,00,000 Budget Each • ₹2,000 Base Price</p>
        </footer>
      </main>
    </div>
  );
}
