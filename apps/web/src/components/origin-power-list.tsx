import { useOriginBuilder } from "@/hooks/use-origin-builder";
import type { StoredPowerType } from "@/lib/types";
import {
    type DragEndEvent,
    DndContext,
    type DraggableAttributes,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    type DragStartEvent,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
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
import type React from "react";
import { act, forwardRef, useMemo, useState } from "react";
import { getValueAtPath, setValueAtPath } from "@repo/utils";
import useDebounce from "@/hooks/use-debounce";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export default function OriginPowerList() {
    const { selectedOrigin, reorderPowers } = useOriginBuilder();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeId, setActiveId] = useState<number | null>(null);
    const activePower = useMemo(
        () => selectedOrigin?.powers.find((power) => power.id === activeId),
        [selectedOrigin, activeId]
    );

    if (!selectedOrigin)
        return (
            <div className="text-muted-foreground text-center">
                Select or create an origin project to add & remove powers...
            </div>
        );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(Number(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        reorderPowers(selectedOrigin.id, Number(active.id), Number(over.id));

        setActiveId(null);
    };

    return (
        <div className="space-y-6">
            <DndContext
                sensors={sensors}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={selectedOrigin.powers}
                    strategy={verticalListSortingStrategy}
                >
                    {selectedOrigin.powers.map((power) => (
                        <DraggablePower
                            key={power.id}
                            power={power}
                        />
                    ))}
                </SortableContext>
                <DragOverlay>
                    {activePower && <OriginPower power={activePower} />}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

type DraggablePowerProps = {
    power: StoredPowerType;
};

function DraggablePower({ power }: DraggablePowerProps) {
    const {
        setNodeRef,
        listeners,
        attributes,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: power.id });

    const style = {
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <OriginPower
            power={power}
            ref={setNodeRef}
            attributes={attributes}
            listeners={listeners}
            style={style}
        />
    );
}

type OriginPowerProps = DraggablePowerProps & {
    listeners?: SyntheticListenerMap;
    attributes?: DraggableAttributes;
    style?: React.CSSProperties;
};

const OriginPower = forwardRef<HTMLDivElement, OriginPowerProps>(
    ({ power, attributes, listeners, style }, ref) => {
        const debounce = useDebounce();

        const { selectedOrigin, updateSelectedOriginPower, deletePower } =
            useOriginBuilder();

        const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
            const name = e.currentTarget.value;

            debounce(
                () =>
                    updateSelectedOriginPower(power.id, {
                        name,
                    }),
                "name"
            );
        };

        const handleDescriptionInput = (
            e: React.FormEvent<HTMLTextAreaElement>
        ) => {
            const description = e.currentTarget.value;

            debounce(
                () =>
                    updateSelectedOriginPower(power.id, {
                        description,
                    }),
                "description"
            );
        };

        const handleHiddenToggle = (checked: boolean) => {
            debounce(
                () =>
                    updateSelectedOriginPower(power.id, {
                        hidden: checked,
                    }),
                "hidden"
            );
        };

        const handleDelete = () => {
            if (!selectedOrigin) return;

            deletePower(selectedOrigin.id, power.id);
        };

        return (
            <div
                ref={ref}
                className="group relative border rounded-lg p-6 pl-2 flex gap-5 bg-card"
                style={style}
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
                                defaultValue={power.data.name}
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
                                    If set to true, this power will not be
                                    displayed in the power list of the origin.
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
                                            configurableField={
                                                configurableField
                                            }
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
);

type ConfigurableFieldProps = {
    configurableField: ConfigurableField;
    power: StoredPowerType;
};

function PowerConfigurableField({
    configurableField,
    power,
}: ConfigurableFieldProps) {
    const { selectedOrigin, updatePower } = useOriginBuilder();

    const debounce = useDebounce();

    const value = useMemo(() => {
        const value = getValueAtPath(power.data, configurableField.fieldPath);

        return typeof value === "object" ? JSON.stringify(value) : value;
    }, [configurableField.fieldPath, power.data]);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (!selectedOrigin) return;

        debounce(() =>
            updatePower(
                selectedOrigin.id,
                power.id,
                setValueAtPath(
                    power.data,
                    configurableField.fieldPath,
                    e.currentTarget.value
                )
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
