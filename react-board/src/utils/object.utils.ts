export const generateId = (): string => {
    return Math.random().toString(36).slice(2, 10);
}

export const randomFrom= <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
}