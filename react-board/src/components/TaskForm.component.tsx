import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import {
  ASSIGNEES,
  COLUMN_LABELS,
  COLUMN_ORDER,
  PROJECTS,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "../types/task.types";
import { useTasks } from "../hooks/useTasks";

type Props = {
  task: Task | null;
  onSaved: () => void;
  onCancel: () => void;
};

const priorities: TaskPriority[] = ["low", "medium", "high", "critical"];

const toInputDate = (date: Date | null | undefined) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export const TaskForm = ({ task, onSaved, onCancel }: Props) => {
  const { addTask, updateTask } = useTasks();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [assignee, setAssignee] = useState(task?.assignee ?? ASSIGNEES[0]);
  const [projectId, setProjectId] = useState(task?.projectId ?? PROJECTS[0].id);
  const [dueDate, setDueDate] = useState(toInputDate(task?.dueDate));
  const [tags, setTags] = useState(task?.tags.join(", ") ?? "");
  const [submitted, setSubmitted] = useState(false);

  const titleError =
    submitted &&
    (title.trim().length < 3 || title.trim().length > 120);

  const handleSubmit = () => {
    setSubmitted(true);

    if (title.trim().length < 3 || title.trim().length > 120) {
      return;
    }

    const parsedTags = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee,
      projectId,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: parsedTags,
    };

    if (task) {
      updateTask(task.id, payload);
    } else {
      addTask(payload);
    }

    onSaved();
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
          helperText={titleError ? "Title must be 3-120 characters" : ""}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            fullWidth
          >
            {COLUMN_ORDER.map((status) => (
              <MenuItem key={status} value={status}>
                {COLUMN_LABELS[status]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            fullWidth
          >
            {priorities.map((priority) => (
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
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            fullWidth
          >
            {ASSIGNEES.map((person) => (
              <MenuItem key={person} value={person}>
                {person}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            fullWidth
          >
            {PROJECTS.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
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