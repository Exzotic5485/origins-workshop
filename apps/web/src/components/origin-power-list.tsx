import { useOriginBuilder } from "@/hooks/use-origin-builder";
import type { StoredPowerType } from "@/lib/types";
import {
    type DragEndEvent,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    restrictToParentElement,
    restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { GripVerticalIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function OriginPowerList() {
    const { selectedOrigin, reorderPowers } = useOriginBuilder();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (!selectedOrigin)
        return (
            <div className="text-muted-foreground text-center">
                Select or create an origin project to add & remove powers...
            </div>
        );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        reorderPowers(selectedOrigin.id, Number(active.id), Number(over.id));
    };

    return (
        <div className="space-y-6">
            <DndContext
                sensors={sensors}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={selectedOrigin.powers}>
                    {selectedOrigin.powers.map((power) => (
                        <OriginPower
                            key={power.id}
                            power={power}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}

type OriginPowerProps = {
    power: StoredPowerType;
};

function OriginPower({ power }: OriginPowerProps) {
    const { setNodeRef, listeners, attributes, transform, transition } =
        useSortable({ id: power.id });

    const { updateSelectedOriginPower } = useOriginBuilder();

    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value)
        updateSelectedOriginPower(power.id, {
            name: e.currentTarget.value,
        });
    };

    const handleDescriptionInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        updateSelectedOriginPower(power.id, {
            description: e.currentTarget.value,
        });
    };

    const handleHiddenToggle = (checked: boolean) => {
        updateSelectedOriginPower(power.id, {
            hidden: checked,
        });
    };

    return (
        <div
            className="border rounded-lg p-6 pl-2 flex gap-5"
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <button
                {...attributes}
                {...listeners}
            >
                <GripVerticalIcon className="size-6 text-muted-foreground" />
            </button>
            <div className="flex-1 space-y-6">
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                        className={cn(
                            power.data.hidden && "text-muted-foreground"
                        )}
                        value={power.data.name}
                        onInput={handleNameInput}
                    />
                    <p className="text-sm text-muted-foreground">
                        The display name of the power.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        className={cn(
                            power.data.hidden && "text-muted-foreground"
                        )}
                        defaultValue={power.data.description}
                        onInput={handleDescriptionInput}
                    />
                    <p className="text-sm text-muted-foreground">
                        The description of the power.
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Label>Hidden</Label>
                        <p className="text-sm text-muted-foreground">
                            If set to true, this power will not be displayed in
                            the power list of the origin.
                        </p>
                    </div>
                    <Switch
                        defaultChecked={power.data.hidden}
                        onCheckedChange={handleHiddenToggle}
                    />
                </div>
            </div>
        </div>
    );
}
