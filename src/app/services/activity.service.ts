import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, interval, combineLatest } from 'rxjs';
import { takeUntil, map, switchMap, startWith } from 'rxjs/operators';
import { ActivityEvent, ASSIGNEES } from '../models/task.model';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const EVENT_TEMPLATES: Array<{
  type: ActivityEvent['type'];
  detail: (title: string) => string;
}> = [
  { type: 'created', detail: t => `created task "${t}"` },
  { type: 'updated', detail: t => `updated description on "${t}"` },
  { type: 'moved', detail: t => `moved "${t}" to In Progress` },
  { type: 'moved', detail: t => `moved "${t}" to Review` },
  { type: 'completed', detail: t => `marked "${t}" as Done` },
];

const SAMPLE_TITLES = [
  'Fix login redirect bug',
  'Add dark mode toggle',
  'Improve error messages',
  'Refactor auth middleware',
  'Update API docs',
  'Write E2E tests',
  'Optimize bundle size',
  'Fix mobile layout',
  'Add rate limiting',
  'Improve search UX',
];

@Injectable({ providedIn: 'root' })
export class ActivityService implements OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  private readonly _feed$ = new BehaviorSubject<ActivityEvent[]>(
    this.generateInitialFeed()
  );

  readonly feed$ = this._feed$.asObservable();

  readonly recentFeed$ = this._feed$.pipe(
    map(events => events.slice(0, 20))
  );

  private readonly _filterQuery$ = new BehaviorSubject<string>('');

  readonly filteredFeed$ = combineLatest([
    this._feed$,
    this._filterQuery$,
  ]).pipe(
    map(([events, query]) => {
      if (!query.trim()) return events.slice(0, 20);
      const q = query.toLowerCase();
      return events
        .filter(e => e.taskTitle.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q))
        .slice(0, 20);
    })
  );

  constructor() {
    interval(4000)
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.pushRandomEvent();
      });
  }

  setFilter(query: string): void {
    this._filterQuery$.next(query);
  }

  pushEvent(event: Omit<ActivityEvent, 'id' | 'timestamp'>): void {
    const full: ActivityEvent = {
      ...event,
      id: generateId(),
      timestamp: new Date(),
    };
    this._feed$.next([full, ...this._feed$.getValue()].slice(0, 100));
  }

  private pushRandomEvent(): void {
    const template = randomFrom(EVENT_TEMPLATES);
    const title = randomFrom(SAMPLE_TITLES);
    this.pushEvent({
      type: template.type,
      taskId: generateId(),
      taskTitle: title,
      actor: randomFrom(ASSIGNEES),
      detail: template.detail(title),
    });
  }

  private generateInitialFeed(): ActivityEvent[] {
    const events: ActivityEvent[] = [];
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      const template = randomFrom(EVENT_TEMPLATES);
      const title = randomFrom(SAMPLE_TITLES);
      events.push({
        id: generateId(),
        type: template.type,
        taskId: generateId(),
        taskTitle: title,
        actor: randomFrom(ASSIGNEES),
        detail: template.detail(title),
        timestamp: new Date(now.getTime() - i * 3 * 60 * 1000),
      });
    }
    return events;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
