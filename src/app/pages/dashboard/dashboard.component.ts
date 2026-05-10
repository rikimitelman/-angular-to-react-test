import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskService } from '../../services/task.service';
import { ActivityService } from '../../services/activity.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { ActivityEvent, PROJECTS, StatsSnapshot } from '../../models/task.model';

interface BarDatum {
  label: string;
  value: number;
  color: string;
  pct: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [NgClass, RouterLink, TimeAgoPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly taskService = inject(TaskService);
  private readonly activityService = inject(ActivityService);

  readonly stats = this.taskService.stats;
  readonly projects = PROJECTS;

  readonly activityFeed = signal<ActivityEvent[]>([]);

  readonly donutSegments = computed(() => this.buildDonutSegments(this.stats()));

  readonly barData = computed<BarDatum[]>(() => {
    const s = this.stats();
    const max = Math.max(s.todo, s.inProgress, s.review, s.done, 1);
    return [
      { label: 'To Do', value: s.todo, color: '#64748b', pct: (s.todo / max) * 100 },
      { label: 'In Progress', value: s.inProgress, color: '#6366f1', pct: (s.inProgress / max) * 100 },
      { label: 'Review', value: s.review, color: '#f59e0b', pct: (s.review / max) * 100 },
      { label: 'Done', value: s.done, color: '#22c55e', pct: (s.done / max) * 100 },
    ];
  });

  readonly projectTaskCounts = computed(() => {
    const tasks = this.taskService.tasks();
    return PROJECTS.map(p => ({
      ...p,
      count: tasks.filter(t => t.projectId === p.id).length,
      done: tasks.filter(t => t.projectId === p.id && t.status === 'done').length,
    }));
  });

  ngOnInit(): void {
    this.activityService.recentFeed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(feed => this.activityFeed.set(feed));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  eventIcon(type: ActivityEvent['type']): string {
    const icons: Record<ActivityEvent['type'], string> = {
      created: '✦',
      updated: '✎',
      moved: '→',
      completed: '✓',
    };
    return icons[type];
  }

  eventClass(type: ActivityEvent['type']): string {
    const cls: Record<ActivityEvent['type'], string> = {
      created: 'ev-created',
      updated: 'ev-updated',
      moved: 'ev-moved',
      completed: 'ev-completed',
    };
    return cls[type];
  }

  private buildDonutSegments(stats: StatsSnapshot) {
    const total = stats.total || 1;
    const slices = [
      { label: 'To Do', value: stats.todo, color: '#64748b' },
      { label: 'In Progress', value: stats.inProgress, color: '#6366f1' },
      { label: 'Review', value: stats.review, color: '#f59e0b' },
      { label: 'Done', value: stats.done, color: '#22c55e' },
    ];

    const cx = 60, cy = 60, r = 48, innerR = 30;
    let cumulativeAngle = -Math.PI / 2;
    const segments: Array<{
      path: string;
      color: string;
      label: string;
      value: number;
    }> = [];

    for (const slice of slices) {
      if (slice.value === 0) continue;
      const angle = (slice.value / total) * 2 * Math.PI;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle = endAngle;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const ix1 = cx + innerR * Math.cos(endAngle);
      const iy1 = cy + innerR * Math.sin(endAngle);
      const ix2 = cx + innerR * Math.cos(startAngle);
      const iy2 = cy + innerR * Math.sin(startAngle);
      const largeArc = angle > Math.PI ? 1 : 0;

      const path = [
        `M ${x1} ${y1}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
        'Z',
      ].join(' ');

      segments.push({ path, color: slice.color, label: slice.label, value: slice.value });
    }
    return segments;
  }
}
