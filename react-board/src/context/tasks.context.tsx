import { createContext } from 'react';
import type { Task, TaskStatus } from '../types/task.types';

type TasksContextProps = {
    tasks: Task[];
    stats:{  total: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  overdue: number;
  completionRate: number;};
    tasksByStatus:(Record<TaskStatus, Task[]>);
    updateTask: (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
    moveTask: (id: string, newStatus: TaskStatus) => void;
    addTask: (partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
    deleteTask: (id: string) => void;
    // todo: why undefined
    getById: (id: string) => Task | undefined;
    reorderInColumn:(status: TaskStatus, previousIndex: number, currentIndex: number)=>void;
};

export const TasksContext = createContext<TasksContextProps | undefined>(
    undefined
);