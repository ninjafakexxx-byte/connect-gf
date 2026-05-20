import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppProviders } from "@/providers/AppProviders";
import { RegisterSW } from "@/components/pwa/register-sw";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" },
      { title: "Connect GF — Grupo Familiar" },
      { name: "description", content: "An admin dashboard for managing members, visitors, and offers with real-time data visualization." },
      { name: "author", content: "Lovable" },
      { name: "theme-color", content: "#0A84FF" },
      { name: "background-color", content: "#050816" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Connect GF" },
      { name: "application-name", content: "Connect GF" },
      { name: "format-detection", content: "telephone=no" },
      { property: "og:title", content: "Connect GF — Grupo Familiar" },
      { property: "og:description", content: "An admin dashboard for managing members, visitors, and offers with real-time data visualization." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Connect GF — Grupo Familiar" },
      { name: "twitter:description", content: "An admin dashboard for managing members, visitors, and offers with real-time data visualization." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c66b3cd6-c9e1-435a-bb27-c66e07e6ad6d/id-preview-355f4cbb--6a563240-feb4-410e-80cd-9114f544fc88.lovable.app-1778608976431.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c66b3cd6-c9e1-435a-bb27-c66e07e6ad6d/id-preview-355f4cbb--6a563240-feb4-410e-80cd-9114f544fc88.lovable.app-1778608976431.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icons/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icons/icon-512.png" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Inline pre-hydration script — applies theme attribute BEFORE first paint to
// eliminate the dark/black flash and the cross-route desync where some pages
// rendered with the wrong data-theme until F5.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;d.classList.remove('dark','black');if(t==='black'){d.classList.add('black');d.setAttribute('data-theme','premium-dark');}else{d.classList.add('dark');d.setAttribute('data-theme','classic');}}catch(e){}})();`;

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-theme="classic">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAuthLayout = path === "/login" || path === "/reset-password";

  // Re-assert data-theme on every client-side navigation so any framework
  // remount that resets <html> attrs cannot leave a page on the wrong theme.
  if (typeof window !== "undefined") {
    try {
      const t = localStorage.getItem("theme");
      const d = document.documentElement;
      const want = t === "black" ? "premium-dark" : "classic";
      if (d.getAttribute("data-theme") !== want) {
        d.classList.remove("dark", "black");
        d.classList.add(t === "black" ? "black" : "dark");
        d.setAttribute("data-theme", want);
      }
    } catch {}
  }

  return (
    <AppProviders queryClient={queryClient}>
      <RegisterSW />
      <RouteGuard>
        {isAuthLayout ? <Outlet /> : <AppLayout />}
      </RouteGuard>
    </AppProviders>
  );
}
