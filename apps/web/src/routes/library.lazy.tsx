import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLazyFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";

export const Route = createLazyFileRoute("/library")({
    component: Library,
});

function Library() {
    return (
        <div className="container mx-auto py-16">
            <SearchCard />
        </div>
    );
}

function SearchCard() {
    return (
        <Card className="p-4 flex items-center">
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
    
}
