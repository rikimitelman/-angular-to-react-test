import { Injectable, signal, computed, effect } from '@angular/core';
import {
  Task,
  TaskStatus,
  TaskPriority,
  ASSIGNEES,
  PROJECTS,
} from '../models/task.model';

const STORAGE_KEY = 'pm_tasks';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function seedTasks(): Task[] {
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'critical'];
  const tagPool = ['bug', 'feature', 'docs', 'refactor', 'test', 'ux', 'perf', 'security'];

  const titles = [
    'Implement user authentication flow',
    'Fix pagination bug on dashboard',
    'Refactor API response caching',
    'Add unit tests for payment module',
    'Design new onboarding screens',
    'Migrate database to PostgreSQL',
    'Set up CI/CD pipeline',
    'Resolve memory leak in worker service',
    'Update API documentation',
    'Implement dark mode support',
    'Add CSV export feature',
    'Fix broken layout on mobile',
    'Code review for PR #241',
    'Performance audit on search endpoint',
    'Write E2E tests for checkout flow',
    'Integrate third-party analytics SDK',
    'Sync translations for 5 locales',
    'Harden input validation across forms',
    'Investigate flaky test in CI',
    'Deploy hotfix to staging',
  ];

  const now = new Date();

  return titles.map((title, i) => {
    const createdAt = new Date(now.getTime() - (20 - i) * 24 * 60 * 60 * 1000);
    const dueDays = Math.floor(Math.random() * 30) - 5;
    return {
      id: generateId(),
      title,
      description: `This task covers the work needed for: ${title.toLowerCase()}. Acceptance criteria are defined in the linked spec doc.`,
      status: randomFrom(statuses),
      priority: randomFrom(priorities),
      assignee: randomFrom(ASSIGNEES),
      projectId: randomFrom(PROJECTS).id,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000),
      tags: [randomFrom(tagPool), randomFrom(tagPool)].filter((v, i, a) => a.indexOf(v) === i),
    };
  });
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly _tasks = signal<Task[]>(this.loadFromStorage());

  readonly tasks = this._tasks.asReadonly();

  readonly stats = computed(() => {
    const tasks = this._tasks();
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
  });

  readonly tasksByStatus = computed(() => {
    const map: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'done': [],
    };
    for (const task of this._tasks()) {
      map[task.status].push(task);
    }
    return map;
  });

  constructor() {
    effect(() => {
      this.saveToStorage(this._tasks());
    });
  }

  getById(id: string): Task | undefined {
    return this._tasks().find(t => t.id === id);
  }

  addTask(partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const now = new Date();
    const task: Task = {
      ...partial,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this._tasks.update(tasks => [...tasks, task]);
    return task;
  }

  updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
    this._tasks.update(tasks =>
      tasks.map(t =>
        t.id === id ? { ...t, ...changes, updatedAt: new Date() } : t
      )
    );
  }

  moveTask(id: string, newStatus: TaskStatus): void {
    this.updateTask(id, { status: newStatus });
  }

  deleteTask(id: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  reorderInColumn(status: TaskStatus, previousIndex: number, currentIndex: number): void {
    this._tasks.update(tasks => {
      const columnTasks = tasks.filter(t => t.status === status);
      const otherTasks = tasks.filter(t => t.status !== status);
      const [moved] = columnTasks.splice(previousIndex, 1);
      columnTasks.splice(currentIndex, 0, moved);
      return [...otherTasks, ...columnTasks];
    });
  }

  private loadFromStorage(): Task[] {
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
    return seedTasks();
  }

  private saveToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }
}
