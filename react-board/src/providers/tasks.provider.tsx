import {
    useEffect,
    useMemo,
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


    const stats = useMemo(() => {
        const now = new Date();
        const total = tasks.length;
        const done = tasks.filter(t => t.status === 'done').length;
        return {
            total,
            todo: tasks.filter(t => t.status === 'todo').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            review: tasks.filter(t => t.status === 'review').length,
            done,
            overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length,
            completionRate: total ? Math.round((done / total) * 100) : 0,
        };
    }, [tasks]);

    const tasksByStatus = useMemo(() => {
        const map: Record<TaskStatus, Task[]> = {
            'todo': [],
            'in-progress': [],
            'review': [],
            'done': [],
        };
        for (const task of tasks) {
            map[task.status].push(task);
        }
        return map;
    }, [tasks]);

    useEffect(() => {
        saveToStorage(tasks);
    }, [tasks]);

    // todo: change to const syntax
    const getById = (id: string): Task | undefined => {
        return tasks.find(t => t.id === id);
    }

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

    const reorderInColumn = (status: TaskStatus, previousIndex: number, currentIndex: number) => {
        setTasks(tasks => {
            const columnTasks = tasks.filter(t => t.status === status);
            const otherTasks = tasks.filter(t => t.status !== status);
            const [moved] = columnTasks.splice(previousIndex, 1);
            columnTasks.splice(currentIndex, 0, moved);
            return [...otherTasks, ...columnTasks];
        });
    }

    return (
        <TasksContext.Provider value={{
            tasks,
            addTask,
            deleteTask,
            getById,
            updateTask,
            moveTask,
            reorderInColumn,
        }}>
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