import { createContext } from 'react';
import type { Task, TaskStatus } from '../types/task.types';

type TasksContextProps = {
    tasks: Task[];
    updateTask: (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
    moveTask: (id: string, newStatus: TaskStatus) => void;
    addTask: (partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
    deleteTask: (id: string) => void;
};

export const TasksContext = createContext<TasksContextProps | undefined>(
    undefined
);