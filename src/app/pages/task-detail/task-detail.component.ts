import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';

import { TaskService } from '../../services/task.service';
import { ActivityService } from '../../services/activity.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { Task, PROJECTS, COLUMN_LABELS } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [RouterLink, DatePipe, NgClass, TitleCasePipe, TimeAgoPipe, TaskFormComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent implements OnInit {
  readonly task = signal<Task | null>(null);
  readonly notFound = signal(false);
  readonly showEditForm = signal(false);

  readonly project = computed(() => {
    const t = this.task();
    return t ? PROJECTS.find(p => p.id === t.projectId) : null;
  });

  readonly columnLabels = COLUMN_LABELS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private activityService: ActivityService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      return;
    }
    const task = this.taskService.getById(id);
    if (!task) {
      this.notFound.set(true);
    } else {
      this.task.set({ ...task });
    }

    // Re-sync when service changes
    const found = this.taskService.tasks();
    const current = found.find(t => t.id === id);
    if (current) this.task.set({ ...current });
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

  isOverdue(): boolean {
    const t = this.task();
    return !!t?.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done';
  }

  deleteTask(): void {
    const t = this.task();
    if (!t) return;
    this.taskService.deleteTask(t.id);
    this.activityService.pushEvent({
      type: 'updated',
      taskId: t.id,
      taskTitle: t.title,
      actor: t.assignee,
      detail: `deleted task "${t.title}"`,
    });
    this.router.navigate(['/tasks']);
  }

  afterSave(): void {
    const t = this.task();
    if (!t) return;
    const updated = this.taskService.getById(t.id);
    if (updated) this.task.set({ ...updated });
    this.showEditForm.set(false);
  }
}
