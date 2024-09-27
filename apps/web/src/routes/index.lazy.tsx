import OriginBuilderForm from "@/components/origin-builder-form";
import OriginPowerList from "@/components/origin-power-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOriginBuilder } from "@/hooks/use-origin-builder";
import { cn, getMinecraftAssetImage } from "@/lib/utils";
import { createLazyFileRoute } from "@tanstack/react-router";
import { PlusIcon, TrashIcon } from "lucide-react";

export const Route = createLazyFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <div className="container mx-auto py-16 space-y-8">
            <OriginProjectSelect />
            <div className="lg:grid grid-cols-3 gap-6 !mt-4">
                <div className="col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Origin Description</CardTitle>
                            <Separator />
                        </CardHeader>
                        <CardContent>
                            <OriginBuilderForm />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Powers</CardTitle>
                            <Separator />
                        </CardHeader>
                        <CardContent>
                            <OriginPowerList />
                        </CardContent>
                    </Card>
                </div>
                <Card />
            </div>
        </div>
    );
}

function OriginProjectSelect() {
    const {
        origins,
        selectedOrigin,
        selectOrigin,
        createBlankOrigin,
        deleteOrigin,
    } = useOriginBuilder();

    return (
        <Card className="p-2 flex justify-between gap-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {origins.map((origin) => (
                    <div
                        key={origin.id}
                        onClick={() => selectOrigin(origin.id)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && selectOrigin(origin.id)
                        }
                        className={cn(
                            "relative w-64 p-4 rounded-lg flex items-center gap-4 font-medium group cursor-pointer",
                            origin.id === selectedOrigin?.id
                                ? "bg-secondary"
                                : "bg-muted"
                        )}
                    >
                        <img
                            className="size-6 image-pixelated"
                            src={getMinecraftAssetImage(
                                origin.icon || "minecraft:stone"
                            )}
                            alt={origin.icon}
                        />
                        <p className="truncate">
                            {origin.name || "Blank Origin"}
                        </p>
                        <button
                            onClick={() => deleteOrigin(origin.id)}
                            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hidden group-hover:block group-focus-visible:block p-2 rounded-lg text-destructive"
                        >
                            <TrashIcon className="size-5" />
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={createBlankOrigin}
                className="p-4 rounded-lg bg-muted hover:bg-muted-foreground/20 self-baseline"
            >
                <PlusIcon className="size-6" />
            </button>
        </Card>
    );
}
