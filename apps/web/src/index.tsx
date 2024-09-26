import "@/index.css";
import "@fontsource/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    RouterProvider,
    createRouter,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { OriginBuilderProvider } from "@/hooks/use-origin-builder";
import { routeTree } from "@/routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
    routeTree,
    context: {
        // biome-ignore lint/style/noNonNullAssertion: it will be set later down
        auth: undefined!,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// biome-ignore lint/style/noNonNullAssertion: root will always exist
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <OriginBuilderProvider>
                    <RouterProviderWithContext />
                </OriginBuilderProvider>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
);

function RouterProviderWithContext() {
    const auth = useAuth();

    return (
        <RouterProvider
            router={router}
            context={{ auth }}
        />
    );
}
