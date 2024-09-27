import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
    component: () => <Outlet />,
    beforeLoad: async ({ context }) => {
        const user = await context.auth.ensureUser();

        if (!user)
            throw redirect({
                to: "/login",
            });

        return { user };
    },
});
