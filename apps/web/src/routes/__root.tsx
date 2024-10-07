import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import type { useAuth } from "@/hooks/use-auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

type RouterContext = {
    auth: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <>
            <Header />
            <Outlet />
            <Toaster />
        </>
    ),
});
