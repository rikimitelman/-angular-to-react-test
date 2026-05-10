import { Component, computed, signal } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDropListGroup,
  CdkDragPlaceholder,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { TaskService } from '../../services/task.service';
import { ActivityService } from '../../services/activity.service';
import {
  Task,
  TaskStatus,
  COLUMN_ORDER,
  COLUMN_LABELS,
  PROJECTS,
} from '../../models/task.model';

@Component({
  selector: 'app-board',
  imports: [NgClass, DatePipe, RouterLink, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder, TaskFormComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  readonly columnOrder = COLUMN_ORDER;
  readonly columnLabels = COLUMN_LABELS;

  readonly filterAssignee = signal<string>('');
  readonly filterPriority = signal<string>('');
  readonly searchQuery = signal<string>('');

  readonly tasksByStatus = computed(() => {
    const all = this.taskService.tasks();
    const assignee = this.filterAssignee();
    const priority = this.filterPriority();
    const query = this.searchQuery().toLowerCase();

    const filtered = all.filter(t => {
      if (assignee && t.assignee !== assignee) return false;
      if (priority && t.priority !== priority) return false;
      if (query && !t.title.toLowerCase().includes(query)) return false;
      return true;
    });

    const map: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'done': [],
    };
    for (const task of filtered) {
      map[task.status].push(task);
    }
    return map;
  });

  readonly totalTaskCount = computed(() => {
    const m = this.tasksByStatus();
    return m['todo'].length + m['in-progress'].length + m['review'].length + m['done'].length;
  });

  readonly showForm = signal(false);
  readonly editingTask = signal<Task | null>(null);

  constructor(
    private taskService: TaskService,
    private activityService: ActivityService,
  ) {}

  getProject(projectId: string) {
    return PROJECTS.find(p => p.id === projectId);
  }

  priorityClass(priority: string): string {
    const map: Record<string, string> = {
      low: 'p-low',
      medium: 'p-medium',
      high: 'p-high',
      critical: 'p-critical',
    };
    return map[priority] ?? '';
  }

  columnClass(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      'todo': 'col-todo',
      'in-progress': 'col-inprogress',
      'review': 'col-review',
      'done': 'col-done',
    };
    return map[status];
  }

  isOverdue(task: Task): boolean {
    return !!task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  }

  onDrop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus): void {
    const task: Task = event.item.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.taskService.reorderInColumn(targetStatus, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.taskService.moveTask(task.id, targetStatus);
      this.activityService.pushEvent({
        type: 'moved',
        taskId: task.id,
        taskTitle: task.title,
        actor: task.assignee,
        detail: `moved "${task.title}" to ${COLUMN_LABELS[targetStatus]}`,
      });
    }
  }

  openAddTask(): void {
    this.editingTask.set(null);
    this.showForm.set(true);
  }

  openEditTask(task: Task): void {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTask.set(null);
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id);
  }
}
