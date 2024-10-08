import Avatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { LogInIcon, LogOutIcon, UploadIcon } from "lucide-react";

export default function Header() {
    return (
        <div className="sticky top-0 bg-background/80 z-50 h-16 border-b">
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
                <AuthButtons />
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

function AuthButtons() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <Skeleton className="size-10 rounded-full" />;
    }

    if (!user) {
        return (
            <Button
                size="sm"
                asChild
            >
                <Link to="/login">
                    <LogInIcon className="size-4 mr-1" />
                    Login
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar
                    username={user.username}
                    className="rounded-full"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/library/upload">
                        <UploadIcon className="size-4 mr-2" />
                        Upload Power
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/api/auth/logout">
                        <LogOutIcon className="size-4 mr-2" />
                        Logout
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
