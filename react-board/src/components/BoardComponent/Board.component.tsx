import { useCallback, useMemo, useState } from "react";
import { COLUMN_LABELS, COLUMN_ORDER, type Task, type TaskStatus } from "../../types/task.types";
import { useTasks } from "../../hooks/useTasks";
import {
    Box,

    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import { TaskForm } from "../TaskForm.component";
import { BoardToolbar } from "./BoardToolbar.component";
import { BoardColumn } from "./BoardColumn.component";
import { filterTasks, getTotalTaskCount, groupTasksByStatus } from "../../utils/task.utils";
import { columnColors } from "../../consts/consts";

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
        const filteredTasks = filterTasks(tasks, {
            assignee: filterAssignee,
            priority: filterPriority,
            searchQuery,
        });

        return groupTasksByStatus(filteredTasks);
    }, [tasks, filterAssignee, filterPriority, searchQuery]);

    const handleDropTask = useCallback((taskId: string, targetStatus: TaskStatus) => {
        const draggedTask = tasks.find((task) => task.id === taskId);

        if (!draggedTask || draggedTask.status === targetStatus) {
            setDraggedTaskId(null);
            return;
        }

        moveTask(taskId, targetStatus);
        setDraggedTaskId(null);
    },[tasks, moveTask]);

    const clearFilters = () => {
        setSearchQuery("");
        setFilterAssignee("");
        setFilterPriority("");
    };

    const totalTaskCount = useMemo(() => {
        return getTotalTaskCount(tasksByStatus)
    }, [tasksByStatus]);

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
            <BoardToolbar
                totalTaskCount={totalTaskCount}
                searchQuery={searchQuery}
                filterAssignee={filterAssignee}
                filterPriority={filterPriority}
                onSearchChange={setSearchQuery}
                onAssigneeChange={setFilterAssignee}
                onPriorityChange={setFilterPriority}
                onAddTask={openAddTask}
                onClearFilters={clearFilters}
            />
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(280px, 1fr))",
                    gap: 2,
                    alignItems: "start",
                }}
            >
                {columnOrder.map((status) => (
                    <BoardColumn
                        key={status}
                        status={status}
                        label={columnLabels[status]}
                        tasks={tasksByStatus[status]}
                        borderColor={columnColors[status]}
                        draggedTaskId={draggedTaskId}
                        onDropTask={handleDropTask}
                        onClearDraggedTask={() => setDraggedTaskId(null)}
                        onEditTask={openEditTask}
                        onDeleteTask={deleteTask}
                        onDragStart={setDraggedTaskId}
                    />
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