import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

export const Route = createRootRoute({
  component: () => {
    console.log('[Root] Root component rendered');
    return (
      <>
        <SkipLink />
        <div id="main-content">
          <Outlet />
        </div>
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </>
    );
  },
});
