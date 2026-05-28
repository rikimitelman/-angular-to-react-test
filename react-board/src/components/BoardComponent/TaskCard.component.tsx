import { Link } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import { PROJECTS, type Task } from "../../types/task.types";
import { priorityColors } from "../../consts/consts";

type Props = {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onDragStart: (id: string) => void;
    onDragEnd: () => void;
};



const getProject = (projectId: string) => {
    return PROJECTS.find((project) => project.id === projectId);
};

const isOverdue = (task: Task): boolean => {
    return (
        !!task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "done"
    );
};

export const TaskCard = ({
    task,
    onEdit,
    onDelete,
    onDragStart,
    onDragEnd,
}: Props) => {
    const overdue = isOverdue(task);
    const project = getProject(task.projectId);

    return (
        <Card
            draggable
            onDragStart={() => onDragStart(task.id)}
            onDragEnd={onDragEnd}
            sx={{
                cursor: "grab",
                "&:active": {
                    cursor: "grabbing",
                },
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
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                            bgcolor: priorityColors[task.priority],
                            color: "white",
                        }}
                    />

                    {overdue && (
                        <Chip label="Overdue" size="small" color="warning" />
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
                    {project?.name}
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
                            color: overdue ? "#ef4444" : "#94a3b8",
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
                    <Button size="small" variant="outlined" onClick={() => onEdit(task)}>
                        Edit
                    </Button>

                    <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};