import type { Task, TaskStatus } from "../types/task.types";

export const groupTasksByStatus = (tasks: Task[]) => {
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
};

export const filterTasks = (
    tasks: Task[],
    filters: {
        assignee: string;
        priority: string;
        searchQuery: string;
    }
) => {
    const query = filters.searchQuery.toLowerCase();

    return tasks.filter((task) => {
        if (filters.assignee && task.assignee !== filters.assignee) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (query && !task.title.toLowerCase().includes(query)) return false;

        return true;
    });
};

export const getTotalTaskCount = (
    tasksByStatus: Record<TaskStatus, Task[]>
) => {
    return (
        tasksByStatus.todo.length +
        tasksByStatus["in-progress"].length +
        tasksByStatus.review.length +
        tasksByStatus.done.length
    );
};

export const isTaskOverdue = (task: Task) => {
    return (
        !!task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "done"
    );
};
