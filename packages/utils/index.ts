// biome-ignore lint/suspicious/noExplicitAny: ...
export function getValueAtPath(object: Record<string, any>, path: string): any {
    const keys = path.split(".");

    let cur = object;

    for (const key of keys) {
        if (cur === undefined || typeof cur !== "object") {
            return undefined;
        }

        cur = cur[key];
    }

    return cur;
    // return keys.reduce((prev, cur) => prev[cur] ?? null, object);
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

        if (typeof prev[cur] !== "object") {
            prev[cur] = {};
        }

        return prev[cur];
    }, object);
}
