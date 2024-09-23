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
import { GripVerticalIcon, TrashIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import type { ConfigurableField } from "@repo/api";
import { useMemo } from "react";
import { getValueAtPath, setValueAtPath } from "@repo/utils";

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

    const { selectedOrigin, updateSelectedOriginPower, deletePower } =
        useOriginBuilder();

    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value);
        updateSelectedOriginPower(power.id, {
            name: e.currentTarget.value,
        });
    };

    const handleDescriptionInput = (
        e: React.FormEvent<HTMLTextAreaElement>
    ) => {
        updateSelectedOriginPower(power.id, {
            description: e.currentTarget.value,
        });
    };

    const handleHiddenToggle = (checked: boolean) => {
        updateSelectedOriginPower(power.id, {
            hidden: checked,
        });
    };

    const handleDelete = () => {
        if (!selectedOrigin) return;

        deletePower(selectedOrigin.id, power.id);
    };

    return (
        <div
            className="group relative border rounded-lg p-6 pl-2 flex gap-5"
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <button
                onClick={handleDelete}
                className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hidden group-hover:block group-focus-visible:block p-2 rounded-lg text-destructive"
            >
                <TrashIcon className="size-5" />
            </button>
            <button
                {...attributes}
                {...listeners}
            >
                <GripVerticalIcon className="size-6 text-muted-foreground" />
            </button>
            <div className="flex-1 space-y-4">
                <div className="border-b pb-1">
                    <span className="text-xl font-medium">
                        {power.remote.name}
                    </span>
                    <p className="text-sm text-muted-foreground">
                        {power.remote.summary}
                    </p>
                </div>
                <div className="space-y-6">
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
                                If set to true, this power will not be displayed
                                in the power list of the origin.
                            </p>
                        </div>
                        <Switch
                            defaultChecked={power.data.hidden}
                            onCheckedChange={handleHiddenToggle}
                        />
                    </div>
                </div>
                {power.remote.configurableFields.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            {power.remote.configurableFields.map(
                                (configurableField) => (
                                    <PowerConfigurableField
                                        key={configurableField.id}
                                        configurableField={configurableField}
                                        power={power}
                                    />
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

type ConfigurableFieldProps = {
    configurableField: ConfigurableField;
    power: StoredPowerType;
};

function PowerConfigurableField({
    configurableField,
    power,
}: ConfigurableFieldProps) {
    const { selectedOrigin, updatePower } = useOriginBuilder();

    const value = useMemo(() => {
        const value = getValueAtPath(power.data, configurableField.fieldPath);

        return typeof value === "object" ? JSON.stringify(value) : value;
    }, [configurableField.fieldPath, power.data]);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (!selectedOrigin) return;

        updatePower(
            selectedOrigin.id,
            power.id,
            setValueAtPath(
                power.data,
                configurableField.fieldPath,
                e.currentTarget.value
            )
        );
    };

    return (
        <div className="space-y-2">
            <Label>{configurableField.name}</Label>
            <Input
                value={value}
                onInput={handleInput}
            />
            <p className="text-sm text-muted-foreground">
                {configurableField.description}
            </p>
        </div>
    );
}
