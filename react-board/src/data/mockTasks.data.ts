import { type Task, type TaskStatus, ASSIGNEES, PROJECTS, type TaskPriority } from "../types/task.types";
import { generateId, randomFrom } from "../utils/object.utils";

export const mockTasks = (): Task[] => {
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
