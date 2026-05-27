import { useMemo, useState } from "react";
import { COLUMN_LABELS, COLUMN_ORDER, PROJECTS, type Task, type TaskStatus, ASSIGNEES } from "../../types/task.types";
import { useTasks } from "../../hooks/useTasks";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Paper,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    MenuItem
} from "@mui/material";
import { Link } from "react-router-dom";
import { TaskForm } from "../TaskForm";


export const Board: React.FC = () => {
    const { tasks, deleteTask, moveTask } = useTasks();
    const columnOrder = COLUMN_ORDER;
    const columnLabels = COLUMN_LABELS;

    const [filterAssignee, setFilterAssignee] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);


    const tasksByStatus = useMemo(() => {
        const query = searchQuery.toLowerCase();
        const assignee = filterAssignee;
        const priority = filterPriority;

        const filtered = tasks.filter(task => {
            if (filterAssignee && task.assignee !== filterAssignee) return false;
            if (filterPriority && task.priority !== filterPriority) return false;
            if (query && !task.title.toLowerCase().includes(query)) return false;
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
    }, [tasks, filterAssignee, filterPriority, searchQuery]);

    const totalTaskCount = useMemo(() => {
        return tasksByStatus.todo.length +
            tasksByStatus["in-progress"].length +
            tasksByStatus.review.length +
            tasksByStatus.done.length
    }, [tasksByStatus]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const taskId = String(active.id);
        const targetStatus = String(over.id) as TaskStatus;

        if (!COLUMN_ORDER.includes(targetStatus)) return;

        moveTask(taskId, targetStatus);
    };
    const getProject = (projectId: string) => {
        return PROJECTS.find(p => p.id === projectId);
    }

    const priorityClass = (priority: string): string => {
        const map: Record<string, string> = {
            low: 'p-low',
            medium: 'p-medium',
            high: 'p-high',
            critical: 'p-critical',
        };
        return map[priority] ?? '';
    }

    const columnClass = (status: TaskStatus): string => {
        const map: Record<TaskStatus, string> = {
            'todo': 'col-todo',
            'in-progress': 'col-inprogress',
            'review': 'col-review',
            'done': 'col-done',
        };
        return map[status];
    }

    const isOverdue = (task: Task): boolean => {
        return !!task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
    }


    const openAddTask = () => {
        setEditingTask(null);
        setShowForm(true);
    }

    const openEditTask = (task: Task) => {
        setEditingTask(task);
        setShowForm(true);
    }

    const closeForm = () => {
        setShowForm(false);
        setEditingTask(null);
    }
    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                p: 3,
                bgcolor: "#0f172a",
                minHeight: "100vh",
            }}
        >
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
            >

                <Typography variant="h4" color="white">
                    Board
                </Typography>

                <Typography color="#94a3b8">
                    {totalTaskCount} tasks

                </Typography>

                <TextField
                    size="small"
                    placeholder="Search task..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        bgcolor: "white",
                        borderRadius: 1,
                    }}
                />
                <TextField
                    select
                    size="small"
                    label="Assignee"
                    value={filterAssignee}
                    onChange={(e) => setFilterAssignee(e.target.value)}
                    sx={{
                        minWidth: 160,
                        bgcolor: "white",
                        borderRadius: 1,
                    }}
                >
                    <MenuItem value="">
                        All
                    </MenuItem>

                    {ASSIGNEES.map((assignee) => (
                        <MenuItem key={assignee} value={assignee}>
                            {assignee}
                        </MenuItem>
                    ))}

                </TextField>

                <TextField
                    select
                    size="small"
                    label="Priority"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    sx={{
                        minWidth: 140,
                        bgcolor: "white",
                        borderRadius: 1,
                    }}
                >
                    <MenuItem value="">
                        All
                    </MenuItem>

                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    onClick={openAddTask}
                >
                    Add Task
                </Button>
            </Stack>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(280px, 1fr))",
                    gap: 2,
                    alignItems: "start",
                }}
            >
                {columnOrder.map((status) => (
                    <Paper
                        key={status}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                            if (draggedTaskId) {
                                moveTask(draggedTaskId, status);
                                setDraggedTaskId(null);
                            }
                        }}
                        sx={{
                            bgcolor: "#111827",
                            border: "1px solid #243044",
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >

                            <Typography
                                sx={{
                                    color: "#bfdbfe",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                }}
                            >
                                {columnLabels[status]}
                            </Typography>

                            <Chip
                                label={tasksByStatus[status].length}
                                size="small"
                                sx={{
                                    bgcolor: "#1e293b",
                                    color: "white",
                                }}
                            />
                        </Stack>

                        {tasksByStatus[status].map((task) => (
                            <Card
                                draggable
                                onDragStart={() => setDraggedTaskId(task.id)}
                                onDragEnd={() => setDraggedTaskId(null)}
                                key={task.id}
                                sx={{
                                    bgcolor: "#1e293b",
                                    border: "1px solid #334155",
                                    opacity: task.status === "done" ? 0.6 : 1,
                                    mb: 1.5,
                                    borderRadius: 2,
                                    transition: "0.2s",
                                    "&:hover": {
                                        borderColor: "#64748b",
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >

                                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ mb: 2 }}
                                    >
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            color="error"
                                        />

                                        {isOverdue(task) && (
                                            <Chip
                                                label="Overdue"
                                                size="small"
                                                color="warning"
                                            />
                                        )}
                                    </Stack>

                                    <Typography
                                        component={Link}
                                        to={`/tasks/${task.id}`}
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            color: "white",
                                            textDecoration: "none",
                                            display: "block",
                                            "&:hover": {
                                                color: "#60a5fa",
                                                textDecoration: "underline",
                                            },
                                        }}
                                    >
                                        {task.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#94a3b8",
                                            mb: 1,
                                        }}
                                    >
                                        {getProject(task.projectId)?.name}
                                    </Typography>

                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                        <Chip
                                            label={task.assignee}
                                            size="small"
                                            sx={{
                                                bgcolor: "#0f172a",
                                                color: "#bfdbfe",
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                color: isOverdue(task) ? "#ef4444" : "#94a3b8",
                                                fontSize: 13,
                                            }}
                                        >
                                            {task.dueDate
                                                ? new Date(task.dueDate).toLocaleDateString()
                                                : "No date"}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                        {task.tags.map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: "#475569",
                                                    color: "#cbd5e1",
                                                }}
                                            />
                                        ))}
                                    </Stack>

                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => openEditTask(task)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            size="small"
                                            color="error"
                                            variant="contained"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>

                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                ))}
            </Box>
            <Dialog
                open={showForm}
                onClose={closeForm}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {editingTask ? "Edit Task" : "Add Task"}
                </DialogTitle>

                <DialogContent>
                    <TaskForm
                        task={editingTask}
                        onSaved={closeForm}
                        onCancel={closeForm}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );

}