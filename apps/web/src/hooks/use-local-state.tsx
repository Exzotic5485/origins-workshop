import { useState } from "react";

type UseLocalStateOptions = {
    key: string;
    json?: boolean;
};

type UpdateStateInput<T> = ((state: T) => T) | T;

export default function useLocalState<T>(
    initialValue: T,
    { key, json }: UseLocalStateOptions
): [
    T,
    (state: UpdateStateInput<T>) => void,
    React.Dispatch<React.SetStateAction<T>>,
] {
    const [state, setState] = useState<T>(() => {
        const value = window.localStorage.getItem(key);

        if (!value) return initialValue;

        return json ? JSON.parse(value) : value;
    });

    const updateState = (input: UpdateStateInput<T>) => {
        // @ts-ignore
        const value = typeof input === "function" ? input(state) : input;

        window.localStorage.setItem(key, json ? JSON.stringify(value) : value);

        setState(value);
    };

    return [state, updateState, setState];
}
