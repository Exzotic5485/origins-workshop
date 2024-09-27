import PowerUploadForm from "@/components/power-upload-form";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/library/upload")({
    component: LibraryUpload,
});

function LibraryUpload() {
    return (
        <div className="container mx-auto py-16 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold">Upload Power</h1>
                <Separator />
            </div>
            <Card className="p-6">
                <PowerUploadForm />
            </Card>
        </div>
    );
}