import { Chip, Paper, Stack, Typography } from "@mui/material";
import type { Task, TaskStatus } from "../../../types/task.types";
import { boardColumnStyles } from "./BoardColumn.styles";
import { TaskCard } from "../../Tasks/TaskCard/TaskCard.component";

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
    const styles = boardColumnStyles(borderColor);

    return (
        <Paper
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
                if (!draggedTaskId) return;

                onDropTask(draggedTaskId, status);
                onClearDraggedTask();
            }}
            sx={styles.root}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={styles.header}
            >
                <Typography
                    sx={styles.title}
                >
                    {label}
                </Typography>

                <Chip
                    label={tasks.length}
                    size="small"
                    sx={styles.countChip}
                />
            </Stack>
            {tasks.length === 0 && (
                <Typography sx={{ color: "#64748b", fontSize: 14 }}>
                    No tasks
                </Typography>
            )}
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