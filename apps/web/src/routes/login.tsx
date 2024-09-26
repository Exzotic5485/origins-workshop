import DiscordIcon from "@/components/icons/discord-icon";
import GithubIcon from "@/components/icons/github-icon";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
    component: Login,
});

function Login() {
    return (
        <div className="min-h-[calc(100dvh-64px)] w-full grid place-items-center">
            <div className="grid max-w-[450px] w-full space-y-4 px-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-4xl font-semibold">Login</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your Origins Workshop account to start
                        uploading powers
                    </p>
                </div>
                <Separator />
                <a
                    href="/api/auth/discord"
                    className={cn(
                        buttonVariants(),
                        "bg-brand-discord hover:bg-brand-discord/80 text-white fill-white"
                    )}
                >
                    <DiscordIcon className="size-6 mr-2" />
                    Login with Discord
                </a>
                <a
                    href="/api/auth/discord"
                    className={cn(
                        buttonVariants(),
                        "bg-brand-github hover:bg-brand-github/80 text-white fill-white"
                    )}
                >
                    <GithubIcon className="size-6 mr-2" />
                    Login with Github
                </a>
            </div>
        </div>
    );
}
