// biome-ignore lint/suspicious/noExplicitAny: ...
export function getValueAtPath(object: Record<string, any>, path: string): any {
    console.log("Finding value:", path);
    const keys = path.split(".");

    return keys.reduce((prev, cur) => prev[cur] ?? null, object);
}

/**
 * @returns the original object with the modified value
 */
export function setValueAtPath(
    // biome-ignore lint/suspicious/noExplicitAny: ...
    object: Record<string, any>,
    path: string,
    value: string
) {
    const keys = path.split(".");

    return keys.reduce((prev, cur, i) => {
        if (i === keys.length - 1) {
            prev[cur] = value;
            return object;
        }

        if(typeof prev[cur] !== "object") {
            prev[cur] = {};
        }

        return prev[cur];
    }, object);
}
