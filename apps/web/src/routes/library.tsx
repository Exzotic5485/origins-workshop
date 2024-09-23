import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOriginBuilder } from "@/hooks/use-origin-builder";
import { getPower, getPowers } from "@/lib/api/powers";
import { getMinecraftAssetImage } from "@/lib/utils";
import type { Power } from "@repo/api";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SearchIcon, Undo2Icon, UndoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/library")({
    component: Library,
    loader: async () => await getPowers(),
});

function Library() {
    return (
        <div className="container mx-auto py-16 space-y-8">
            <SearchCard />
            <PowerList />
        </div>
    );
}

function SearchCard() {
    return (
        <Card className="p-3 flex items-center">
            <div className="relative w-full">
                <Input
                    className="peer pl-8"
                    placeholder="Search for powers..."
                />
                <SearchIcon className="text-muted-foreground peer-focus:text-foreground absolute top-1/2 -translate-y-1/2 left-2 size-5" />
            </div>
        </Card>
    );
}

function PowerList() {
    const { powers } = Route.useLoaderData();

    return (
        <div className="grid space-y-2">
            {powers.map((power) => (
                <PowerCard
                    key={power.id}
                    power={power}
                />
            ))}
        </div>
    );
}

type PowerCardProps = {
    power: {
        id: number;
        name: string;
        summary: string;
    };
};

function PowerCard({ power }: PowerCardProps) {
    const { origins, addPower, deletePower } = useOriginBuilder();

    const [selected, setSelected] = useState<number | null>(null);

    const origin = useMemo(
        () => origins.find((origin) => origin.id === selected),
        [selected, origins]
    );

    const handleAddToOrigin = async () => {
        if (!selected) return;

        const originId = selected;

        const { data, ...remotePower } = await getPower(power.id);

        addPower(originId, {
            id: Date.now(),
            remote: remotePower,
            data
        });

        const t = toast(
            <>
                Added{" "}
                <span className="font-medium text-primary">
                    {remotePower.name}
                </span>{" "}
                to{" "}
                <span className="font-medium text-primary">{origin?.name}</span>
                <button
                    onClick={() => {
                        deletePower(originId, power.id);
                        toast.dismiss(t);
                    }}
                    className="ml-auto p-1 text-muted-foreground hover:text-foreground"
                >
                    <Undo2Icon />
                </button>
            </>
        );
    };

    return (
        <Link
            key={power.id}
            to="."
        >
            <Card className="p-6 flex justify-between">
                <div>
                    <span className="text-2xl font-medium">{power.name}</span>
                    <p className="text-sm text-muted-foreground">
                        {power.summary}
                    </p>
                </div>
                <div className="space-y-2">
                    <Select
                        value={selected?.toString()}
                        onValueChange={(v) => setSelected(Number(v))}
                    >
                        <SelectTrigger className="min-w-[200px]">
                            <SelectValue placeholder="Select project..." />
                        </SelectTrigger>
                        <SelectContent>
                            {origins.map((origin) => (
                                <SelectItem
                                    key={origin.id}
                                    value={origin.id.toString()}
                                >
                                    <div className="flex items-center gap-1">
                                        <img
                                            className="size-5 image-pixelated"
                                            src={getMinecraftAssetImage(
                                                origin.icon
                                            )}
                                            alt=""
                                        />
                                        {origin.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        size="sm"
                        className="w-full"
                        onClick={handleAddToOrigin}
                        disabled={!selected}
                    >
                        Add to Origin
                    </Button>
                </div>
            </Card>
        </Link>
    );
}
