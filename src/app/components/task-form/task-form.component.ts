import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgClass, TitleCasePipe } from '@angular/common';

import { TaskService } from '../../services/task.service';
import { ActivityService } from '../../services/activity.service';
import {
  Task,
  TaskStatus,
  TaskPriority,
  ASSIGNEES,
  PROJECTS,
  COLUMN_ORDER,
  COLUMN_LABELS,
} from '../../models/task.model';

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const value = new Date(control.value);
  if (isNaN(value.getTime())) return { invalidDate: true };
  return null;
}

function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if ((control.value ?? '').trim().length === 0 && control.value?.length > 0) {
    return { whitespace: true };
  }
  return null;
}

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, NgClass, TitleCasePipe],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  readonly assignees = ASSIGNEES;
  readonly projects = PROJECTS;
  readonly statuses = COLUMN_ORDER;
  readonly columnLabels = COLUMN_LABELS;
  readonly priorities: TaskPriority[] = ['low', 'medium', 'high', 'critical'];

  form!: FormGroup;
  submitted = false;

  get isEdit(): boolean {
    return !!this.task;
  }

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private activityService: ActivityService,
  ) {}

  ngOnInit(): void {
    const t = this.task;
    this.form = this.fb.group({
      title: [
        t?.title ?? '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(120), noWhitespaceValidator],
      ],
      description: [
        t?.description ?? '',
        [Validators.maxLength(500)],
      ],
      status: [t?.status ?? 'todo', Validators.required],
      priority: [t?.priority ?? 'medium', Validators.required],
      assignee: [t?.assignee ?? ASSIGNEES[0], Validators.required],
      projectId: [t?.projectId ?? PROJECTS[0].id, Validators.required],
      dueDate: [
        t?.dueDate ? this.toInputDate(new Date(t.dueDate)) : '',
        futureDateValidator,
      ],
      tags: [t?.tags.join(', ') ?? ''],
    });
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.touched && ctrl.hasError(error));
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && (ctrl.touched || this.submitted) && ctrl.invalid);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const val = this.form.value;
    const tags = (val.tags as string)
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const dueDate = val.dueDate ? new Date(val.dueDate) : null;

    if (this.isEdit && this.task) {
      this.taskService.updateTask(this.task.id, {
        title: val.title.trim(),
        description: val.description.trim(),
        status: val.status as TaskStatus,
        priority: val.priority as TaskPriority,
        assignee: val.assignee,
        projectId: val.projectId,
        dueDate,
        tags,
      });
      this.activityService.pushEvent({
        type: 'updated',
        taskId: this.task.id,
        taskTitle: val.title.trim(),
        actor: val.assignee,
        detail: `updated task "${val.title.trim()}"`,
      });
    } else {
      const newTask = this.taskService.addTask({
        title: val.title.trim(),
        description: val.description.trim(),
        status: val.status as TaskStatus,
        priority: val.priority as TaskPriority,
        assignee: val.assignee,
        projectId: val.projectId,
        dueDate,
        tags,
      });
      this.activityService.pushEvent({
        type: 'created',
        taskId: newTask.id,
        taskTitle: newTask.title,
        actor: newTask.assignee,
        detail: `created task "${newTask.title}"`,
      });
    }

    this.saved.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private toInputDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
