export function ensureArray(val: any): any[] {
    return Array.isArray(val) ? val : [val];
}

export function queryArray(val: any): string {
    const arr = ensureArray(val);
    return arr.join(',');
}