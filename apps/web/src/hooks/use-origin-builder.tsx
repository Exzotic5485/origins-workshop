import useLocalState from "@/hooks/use-local-state";
import type {
    OriginType,
    PowerType,
    StoredOriginType,
    StoredPowerType,
} from "@/lib/types";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, useContext, useMemo, useState } from "react";

type OriginBuilderContextType = {
    origins: StoredOriginType[];
    selectedOrigin?: StoredOriginType;
    selectOrigin: (id: number) => void;
    createBlankOrigin: () => void;
    updateOrigin: (id: number, data: Partial<OriginType>) => void;
    updateSelectedOrigin: (data: Partial<OriginType>) => void;
    deleteOrigin: (id: number) => void;
    reorderPowers: (id: number, firstId: number, secondId: number) => void;
    updatePower: (
        originId: number,
        powerId: number,
        data: Partial<PowerType>
    ) => void;
    updateSelectedOriginPower: (id: number, data: Partial<PowerType>) => void;
    addPower: (originId: number, data: StoredPowerType) => void;
    deletePower: (originId: number, powerId: number) => void;
};

const OriginBuilderContext = createContext<OriginBuilderContextType | null>(
    null
);

export function OriginBuilderProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [origins, setOrigins] = useLocalState<StoredOriginType[]>(
        [
            {
                name: "Avian",
                icon: "minecraft:feather",
                description: "",
                impact: 1,
                unchoosable: false,
                id: 1726563624202,
                powers: [],
            },
            {
                name: "Blazeborn",
                icon: "minecraft:blaze_powder",
                description: "",
                impact: 1,
                unchoosable: false,
                id: 1726563624203,
                powers: [],
            },
        ],
        {
            json: true,
            key: "origins",
        }
    );

    const [selectedOriginId, setSelectedOriginId] = useState<number>(0);

    const selectedOrigin = useMemo(
        () => origins.find((origin) => origin.id === selectedOriginId),
        [origins, selectedOriginId]
    );

    const createBlankOrigin = () => {
        setOrigins((origins) => [
            ...origins,
            {
                id: Date.now(),
                name: "",
                icon: "",
                description: "",
                impact: 0,
                unchoosable: false,
                powers: [],
            },
        ]);
    };

    const updateOrigin = (id: number, data: Partial<OriginType>) => {
        const newOrigins = [...origins];

        const index = newOrigins.findIndex((origin) => origin.id === id);

        if (index === -1) return;

        newOrigins[index] = {
            ...newOrigins[index],
            ...data,
        };

        setOrigins(newOrigins);
    };

    const updateSelectedOrigin = (data: Partial<OriginType>) => {
        if (!selectedOrigin) throw new Error("No selected origin to update.");

        updateOrigin(selectedOrigin.id, data);
    };

    const deleteOrigin = (id: number) => {
        setOrigins((origins) => origins.filter((origin) => origin.id !== id));
    };

    // TODO: look into these functions: not sure if this is the best way to update / store the origins powers
    const reorderPowers = (
        originId: number,
        firstId: number,
        secondId: number
    ) => {
        const newOrigins = origins.map((origin) => {
            if (origin.id !== originId) return origin;

            const firstIndex = origin.powers.findIndex(
                (power) => power.id === firstId
            );
            const secondIndex = origin.powers.findIndex(
                (power) => power.id === secondId
            );

            origin.powers = arrayMove(origin.powers, firstIndex, secondIndex);

            return origin;
        });

        setOrigins(newOrigins);
    };

    const updatePower = (
        originId: number,
        powerId: number,
        data: Partial<PowerType>
    ) => {
        const newOrigins = origins.map((origin) => {
            if (origin.id !== originId) return origin;

            const index = origin.powers.findIndex(
                (power) => power.id === powerId
            );

            if (index === -1) return origin;

            origin.powers[index].data = {
                ...origin.powers[index].data,
                ...data,
            };

            return origin;
        });

        setOrigins(newOrigins);
    };

    const updateSelectedOriginPower = (
        id: number,
        data: Partial<PowerType>
    ) => {
        if (!selectedOrigin) throw new Error("No selected origin to update.");

        updatePower(selectedOrigin.id, id, data);
    };

    const addPower = (originId: number, data: StoredPowerType) => {
        const newOrigins = origins.map((origin) => {
            if (origin.id !== originId) return origin;

            origin.powers.push(data);

            return origin;
        });

        setOrigins(newOrigins);
    };

    const deletePower = (originId: number, powerId: number) => {
        const newOrigins = origins.map((origin) => {
            if (origin.id !== originId) return origin;

            origin.powers = origin.powers.filter(
                (power) => power.id !== powerId
            );

            return origin;
        });

        setOrigins(newOrigins);
    };

    return (
        <OriginBuilderContext.Provider
            value={{
                origins,
                selectedOrigin,
                selectOrigin: setSelectedOriginId,
                createBlankOrigin,
                updateOrigin,
                updateSelectedOrigin,
                deleteOrigin,
                reorderPowers,
                updatePower,
                updateSelectedOriginPower,
                addPower,
                deletePower
            }}
        >
            {children}
        </OriginBuilderContext.Provider>
    );
}

export function useOriginBuilder() {
    const context = useContext(OriginBuilderContext);

    if (!context)
        throw new Error(
            "The component that used 'useOriginBuilder' must be wrapped in a 'OriginBuilderProvider'."
        );

    return context;
}
