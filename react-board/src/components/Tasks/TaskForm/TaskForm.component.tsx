import { useEffect, useState } from "react";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import {
  ASSIGNEES,
  COLUMN_LABELS,
  COLUMN_ORDER,
  PROJECTS,
  PRIORITIES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "../../../types/task.types";
import { useTasks } from "../../../hooks/useTasks";
import { isValidTitle, parseTags, toInputDate } from "../../../utils/task.utils";
import { taskFormStyles } from "./TaskForm.styles";

type Props = {
  task: Task | null;
  onSaved: () => void;
  onCancel: () => void;
};

type FormState = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  projectId: string;
  dueDate: string;
  tags: string;
};

const getInitialFormState = (task: Task | null): FormState => ({
  title: task?.title ?? "",
  description: task?.description ?? "",
  status: task?.status ?? "todo",
  priority: task?.priority ?? "medium",
  assignee: task?.assignee ?? ASSIGNEES[0],
  projectId: task?.projectId ?? PROJECTS[0].id,
  dueDate: toInputDate(task?.dueDate),
  tags: task?.tags.join(", ") ?? "",
});

export const TaskForm = ({ task, onSaved, onCancel }: Props) => {
  const { addTask, updateTask } = useTasks();

  const [form, setForm] = useState<FormState>(() => getInitialFormState(task));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm(getInitialFormState(task));
    setSubmitted(false);
  }, [task]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const titleError = submitted && !isValidTitle(form.title);

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isValidTitle(form.title)) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      assignee: form.assignee,
      projectId: form.projectId,
      dueDate: form.dueDate ? new Date(form.dueDate) : null,
      tags: parseTags(form.tags),
    };

    task ? updateTask(task.id, payload) : addTask(payload);
    onSaved();
  };

  return (
    <Box sx={taskFormStyles.root}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          error={titleError}
          helperText={titleError ? "Title must be 3-120 characters" : ""}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value as TaskStatus)}
            fullWidth
          >
            {COLUMN_ORDER.map(status => (
              <MenuItem key={status} value={status}>
                {COLUMN_LABELS[status]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={form.priority}
            onChange={(e) => updateField("priority", e.target.value as TaskPriority)}
            fullWidth
          >
            {PRIORITIES.map(priority => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Assignee"
            value={form.assignee}
            onChange={(e) => updateField("assignee", e.target.value)}
            fullWidth
          >
            {ASSIGNEES.map(person => (
              <MenuItem key={person} value={person}>
                {person}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Project"
            value={form.projectId}
            onChange={(e) => updateField("projectId", e.target.value)}
            fullWidth
          >
            {PROJECTS.map(project => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <TextField
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={(e) => updateField("dueDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Tags"
          value={form.tags}
          onChange={(e) => updateField("tags", e.target.value)}
          placeholder="bug, feature, ux"
          fullWidth
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};