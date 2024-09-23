import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
    Link,
    Outlet,
    createRootRoute,
    useLocation,
} from "@tanstack/react-router";

export const Route = createRootRoute({
    component: () => (
        <>
            <Header />
            <Outlet />
            <Toaster />
        </>
    ),
});

function Header() {
    return (
        <div className="h-16 border-b">
            <div className="container mx-auto px-2 sm:px-4 md:px-8 h-full w-full flex items-center justify-between">
                <div className="flex items-center gap-16">
                    <Link
                        to="/"
                        className="flex items-center gap-2"
                    >
                        <img
                            className="size-12 image-pixelated"
                            src="/logo.png"
                            alt=""
                        />
                        <h1 className="font-monocraft text-base sm:text-xl md:text-2xl tracking-tight font-semibold">
                            Origins Workshop
                        </h1>
                    </Link>
                    <div className="space-x-5">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/library">Power Library</NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavLink({
    to,
    className,
    ...props
}: React.ComponentProps<typeof Link>) {
    const location = useLocation();

    return (
        <Link
            to={to}
            className={cn(
                "text-muted-foreground hover:text-foreground",
                location.pathname === to && "text-foreground",
                className
            )}
            {...props}
        />
    );
}
