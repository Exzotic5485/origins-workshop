import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "@fontsource/inter";
import "@/index.css";

import { routeTree } from "@/routeTree.gen";
import { OriginBuilderProvider } from "@/hooks/use-origin-builder";

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// biome-ignore lint/style/noNonNullAssertion: root will always exist
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <OriginBuilderProvider>
                <RouterProvider router={router} />
            </OriginBuilderProvider>
        </QueryClientProvider>
    </StrictMode>
);
