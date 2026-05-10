import { Component, computed, signal } from '@angular/core';
import { NgClass, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TaskService } from '../../services/task.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { Task, PROJECTS, ASSIGNEES, TaskStatus } from '../../models/task.model';

type SortField = 'title' | 'priority' | 'status' | 'assignee' | 'dueDate' | 'createdAt';
type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER: Record<string, number> = {
  critical: 4, high: 3, medium: 2, low: 1,
};

const PAGE_SIZE = 10;

@Component({
  selector: 'app-tasks',
  imports: [NgClass, DatePipe, TitleCasePipe, RouterLink, HighlightDirective, TaskFormComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  readonly projects = PROJECTS;
  readonly assignees = ASSIGNEES;

  readonly searchQuery = signal('');
  readonly filterStatus = signal<TaskStatus | ''>('');
  readonly filterPriority = signal('');
  readonly filterAssignee = signal('');
  readonly sortField = signal<SortField>('createdAt');
  readonly sortDir = signal<SortDir>('desc');
  readonly currentPage = signal(1);

  readonly selectedIds = signal<Set<string>>(new Set());
  readonly showForm = signal(false);
  readonly editingTask = signal<Task | null>(null);

  private readonly filtered = computed(() => {
    const tasks = this.taskService.tasks();
    const q = this.searchQuery().toLowerCase();
    const status = this.filterStatus();
    const priority = this.filterPriority();
    const assignee = this.filterAssignee();

    return tasks.filter(t => {
      if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      if (status && t.status !== status) return false;
      if (priority && t.priority !== priority) return false;
      if (assignee && t.assignee !== assignee) return false;
      return true;
    });
  });

  readonly sorted = computed(() => {
    const tasks = [...this.filtered()];
    const field = this.sortField();
    const dir = this.sortDir();
    const mult = dir === 'asc' ? 1 : -1;

    return tasks.sort((a, b) => {
      if (field === 'priority') {
        return mult * ((PRIORITY_ORDER[a.priority] ?? 0) - (PRIORITY_ORDER[b.priority] ?? 0));
      }
      if (field === 'dueDate') {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return mult * (aTime - bTime);
      }
      if (field === 'createdAt') {
        return mult * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      const aVal = String(a[field]).toLowerCase();
      const bVal = String(b[field]).toLowerCase();
      return mult * aVal.localeCompare(bVal);
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.sorted().length / PAGE_SIZE)));

  readonly paginated = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * PAGE_SIZE;
    return this.sorted().slice(start, start + PAGE_SIZE);
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  readonly allOnPageSelected = computed(() => {
    const ids = this.selectedIds();
    return this.paginated().length > 0 && this.paginated().every(t => ids.has(t.id));
  });

  constructor(private taskService: TaskService) {}

  getProject(projectId: string) {
    return PROJECTS.find(p => p.id === projectId);
  }

  priorityClass(priority: string): string {
    const map: Record<string, string> = {
      low: 'p-low', medium: 'p-medium', high: 'p-high', critical: 'p-critical',
    };
    return map[priority] ?? '';
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'todo': 's-todo',
      'in-progress': 's-inprogress',
      'review': 's-review',
      'done': 's-done',
    };
    return map[status] ?? '';
  }

  isOverdue(task: Task): boolean {
    return !!task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  }

  sort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  sortIcon(field: SortField): string {
    if (this.sortField() !== field) return '↕';
    return this.sortDir() === 'asc' ? '↑' : '↓';
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.selectedIds.set(new Set());
  }

  toggleSelect(id: string): void {
    this.selectedIds.update(ids => {
      const next = new Set(ids);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  toggleSelectAll(): void {
    if (this.allOnPageSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.paginated().map(t => t.id)));
    }
  }

  bulkSetStatus(status: TaskStatus): void {
    for (const id of this.selectedIds()) {
      this.taskService.moveTask(id, status);
    }
    this.selectedIds.set(new Set());
  }

  bulkDelete(): void {
    for (const id of this.selectedIds()) {
      this.taskService.deleteTask(id);
    }
    this.selectedIds.set(new Set());
  }

  openEdit(task: Task): void {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTask.set(null);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.filterStatus.set('');
    this.filterPriority.set('');
    this.filterAssignee.set('');
    this.currentPage.set(1);
  }
}
