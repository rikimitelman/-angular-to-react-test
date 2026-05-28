import {
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { STORAGE_KEY } from '../consts/consts';
import { TasksContext } from '../context/tasks.context';
import { mockTasks } from '../data/mockTasks.data';
import type { Task, TaskStatus } from '../types/task.types';
import { generateId } from '../utils/object.utils';

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage());


    useEffect(() => {
        saveToStorage(tasks);
    }, [tasks]);


    const addTask = (partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
        const now = new Date();
        const task: Task = {
            ...partial,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
        };
        setTasks(prev => [...prev, task]);
        return task;
    }

    const updateTask = (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
        setTasks(tasks =>
            tasks.map(t =>
                t.id === id ? { ...t, ...changes, updatedAt: new Date() } : t
            )
        );
    }

    const moveTask = (id: string, newStatus: TaskStatus) => {
        updateTask(id, { status: newStatus });
    }

    const deleteTask = (id: string) => {
        setTasks(tasks => tasks.filter(t => t.id !== id));
    }

    return (
        <TasksContext.Provider
            value={{
                tasks,
                addTask,
                deleteTask,
                updateTask,
                moveTask,
            }}
        >
            {children}
        </TasksContext.Provider>
    )
}
function loadFromStorage(): Task[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw) {
            const parsed: Task[] = JSON.parse(raw);

            return parsed.map(t => ({
                ...t,
                createdAt: new Date(t.createdAt),
                updatedAt: new Date(t.updatedAt),
                dueDate: t.dueDate ? new Date(t.dueDate) : null,
            }));
        }
    } catch {
        // ignore
    }

    return mockTasks();
}

function saveToStorage(tasks: Task[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        // ignore
    }
}