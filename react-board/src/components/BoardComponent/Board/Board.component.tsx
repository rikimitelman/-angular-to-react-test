import { useCallback, useMemo, useState } from "react";
import {
  COLUMN_LABELS,
  COLUMN_ORDER,
  type Task,
  type TaskStatus,
} from "../../../types/task.types";
import { useTasks } from "../../../hooks/useTasks";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { TaskForm } from "../../Tasks/TaskForm/TaskForm.component";
import {
  BoardToolbar,
  type BoardFilters,
} from "../BoardToolbar/BoardToolbar.component";
import {
  filterTasks,
  getTotalTaskCount,
  groupTasksByStatus,
} from "../../../utils/task.utils";
import { columnColors } from "../../../consts/consts";
import { boardStyles } from "./Board.styles";
import { BoardColumn } from "../BoardColumn/BoardColumn.component";

export const Board: React.FC = () => {
  const { tasks, deleteTask, moveTask } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const [filters, setFilters] = useState<BoardFilters>({
    assignee: "",
    priority: "",
    searchQuery: "",
  });

  const tasksByStatus = useMemo(() => {
    const filteredTasks = filterTasks(tasks, filters);
    return groupTasksByStatus(filteredTasks);
  }, [tasks, filters]);

  const totalTaskCount = useMemo(() => {
    return getTotalTaskCount(tasksByStatus);
  }, [tasksByStatus]);

  const handleDropTask = useCallback(
    (taskId: string, targetStatus: TaskStatus) => {
      const draggedTask = tasks.find((task) => task.id === taskId);

      if (!draggedTask || draggedTask.status === targetStatus) {
        setDraggedTaskId(null);
        return;
      }

      moveTask(taskId, targetStatus);
      setDraggedTaskId(null);
    },
    [tasks, moveTask]
  );

  const openAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <Box
      sx={boardStyles.root}
    >
      <BoardToolbar
        totalTaskCount={totalTaskCount}
        onFiltersChange={setFilters}
        onAddTask={openAddTask}
      />

      <Box
        sx={boardStyles.columnsGrid}
      >
        {COLUMN_ORDER.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            label={COLUMN_LABELS[status]}
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
};