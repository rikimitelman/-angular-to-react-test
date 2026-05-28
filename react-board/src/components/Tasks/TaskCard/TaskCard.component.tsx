import { Link } from "react-router-dom";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import type { Task } from "../../../types/task.types";
import { getTaskCardStyles } from "./TaskCard.styles";
import { getProject, isTaskOverdue } from "../../../utils/task.utils";
import { priorityColors } from "../../../consts/consts";

type Props = {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onDragStart: (id: string) => void;
    onDragEnd: () => void;
};

export const TaskCard = ({
    task,
    onEdit,
    onDelete,
    onDragStart,
    onDragEnd,
}: Props) => {

    const styles = getTaskCardStyles(task.status === "done");
    const overdue = isTaskOverdue(task);
    const project = getProject(task.projectId);

    return (
        <Card
            draggable
            onDragStart={() => onDragStart(task.id)}
            onDragEnd={onDragEnd}
            sx={styles.root}
        >
            <CardContent sx={styles.content}>
                <Stack direction="row" spacing={1} sx={styles.chipsRow}>
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
                    sx={styles.title}
                >
                    {task.title}
                </Typography>

                <Typography
                    sx={styles.project}
                >
                    {project?.name}
                </Typography>

                <Stack direction="row" justifyContent="space-between" sx={styles.metaRow}>
                    <Chip
                        label={task.assignee}
                        size="small"
                        sx={styles.assigneeChip}
                    />

                    <Typography
                        sx={styles.dueDate(overdue)}
                    >
                        {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No date"}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" sx={styles.chipsRow}>
                    {task.tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={styles.tagChip}
                        />
                    ))}
                </Stack>

                <Stack className="task-actions"
                    direction="row"
                    spacing={1}
                    sx={styles.actions}>
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