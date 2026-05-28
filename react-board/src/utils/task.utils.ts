import { PROJECTS, type Task, type TaskStatus } from "../types/task.types";

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

export const getProject = (projectId: string) => {
    return PROJECTS.find((project) => project.id === projectId);
};

export const toInputDate = (date: Date | null | undefined) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export const parseTags = (tags: string) =>
  tags
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean);

export const isValidTitle = (title: string) => {
  const length = title.trim().length;
  return length >= 3 && length <= 120;
};

export const isValidDescription = (description: string) => {
  return description.trim().length <= 500;
};