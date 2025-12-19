import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Settings, Monitor, Home } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  console.log('[Route: /] Landing page component rendered');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-neutral-900">
            BCL 2025
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-600 mb-4">
            Bidding System
          </h2>
          <p className="text-neutral-500">
            Professional cricket auction management
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              console.log('[Route: /] Navigating to /admin/auction');
              navigate({ to: '/admin/auction' });
            }}
            className="w-full bg-primary-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-3 text-lg shadow-md"
          >
            <Settings className="w-6 h-6" />
            Admin Control Panel
          </button>
          
          <button
            onClick={() => {
              console.log('[Route: /] Navigating to /display');
              navigate({ to: '/display' });
            }}
            className="w-full bg-success-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-success-600 transition-colors flex items-center justify-center gap-3 text-lg shadow-md"
          >
            <Monitor className="w-6 h-6" />
            Display View (Full Screen)
          </button>
          
          <button
            onClick={() => {
              console.log('[Route: /] Navigating to /admin/manage');
              navigate({ to: '/admin/manage' });
            }}
            className="w-full bg-neutral-200 text-neutral-700 py-4 px-6 rounded-lg font-semibold hover:bg-neutral-300 transition-colors flex items-center justify-center gap-3 text-lg"
          >
            <Home className="w-6 h-6" />
            Post-Auction Management
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-500">
          <p>12 Teams • ₹1,00,000 Budget Each • ₹2,000 Base Price</p>
        </div>
      </div>
    </div>
  );
}
