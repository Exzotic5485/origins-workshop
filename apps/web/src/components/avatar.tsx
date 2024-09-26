import { cn } from "@/lib/utils";
import type React from "react";

type AvatarProps = {
    username: string;
} & React.ComponentPropsWithoutRef<"div">;

export default function Avatar({ username, className, ...props }: AvatarProps) {
    const content = username
        .split(" ")
        .map((w) => w[0].toUpperCase())
        .join("");

    return (
        <div
            className={cn(
                "size-10 flex items-center justify-center bg-card p-2 rounded-full border",
                className
            )}
            {...props}
        >
            {content}
        </div>
    );
}
