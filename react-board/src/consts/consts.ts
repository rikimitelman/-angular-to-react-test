import type { TaskStatus } from "../types/task.types";

export const STORAGE_KEY = 'pm_tasks';

export const columnColors: Record<TaskStatus, string> = {
    todo: "#64748b",
    "in-progress": "#2563eb",
    review: "#f59e0b",
    done: "#22c55e",
};

export const priorityColors = {
    low: "#334155",
    medium: "#2563eb",
    high: "#ea580c",
    critical: "#dc2626",
};