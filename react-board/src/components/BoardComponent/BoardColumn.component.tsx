import { Chip, Paper, Stack, Typography } from "@mui/material";
import type { Task, TaskStatus } from "../../types/task.types";
import { TaskCard } from "./TaskCard.component";

type Props = {
    status: TaskStatus;
    label: string;
    tasks: Task[];
    borderColor: string;
    draggedTaskId: string | null;
    onDropTask: (taskId: string, status: TaskStatus) => void;
    onClearDraggedTask: () => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onDragStart: (id: string) => void;
};

export const BoardColumn = ({
    status,
    label,
    tasks,
    borderColor,
    draggedTaskId,
    onDropTask,
    onClearDraggedTask,
    onEditTask,
    onDeleteTask,
    onDragStart,
}: Props) => {
    return (
        <Paper
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
                if (!draggedTaskId) return;

                onDropTask(draggedTaskId, status);
                onClearDraggedTask();
            }}
            sx={{
                bgcolor: "#111827",
                border: "1px solid #243044",
                p: 2,
                borderRadius: 2,
                borderTop: `3px solid ${borderColor}`,
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
                    {label}
                </Typography>

                <Chip
                    label={tasks.length}
                    size="small"
                    sx={{
                        bgcolor: "#1e293b",
                        color: "white",
                    }}
                />
            </Stack>

            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onDragStart={onDragStart}
                    onDragEnd={onClearDraggedTask}
                />
            ))}
        </Paper>
    );
};