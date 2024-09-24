import { useRef } from "react";

export default function useDebounce(ms = 250) {
    const timeouts = useRef<Record<string, number>>({});

    // biome-ignore lint/suspicious/noExplicitAny: accepts any type of function
    return (action: (...args: any) => any, key = "DEFAULT") => {
        clearTimeout(timeouts.current[key]);

        timeouts.current[key] = setTimeout(action, ms);
    };
}
