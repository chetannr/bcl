import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Home } from 'lucide-react';

export const Route = createFileRoute('/admin/auction')({
  component: AdminAuctionPlaceholder,
});

function AdminAuctionPlaceholder() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Admin Auction Control</h1>
        <p className="text-neutral-600 mb-6">This page is temporarily disabled. Dynamic pages will be enabled later.</p>
        <button
          onClick={() => navigate({ to: '/home' })}
          className="flex items-center gap-2 px-4 py-2 mx-auto text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
