import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ASSIGNEES } from "../../types/task.types";

type Props = {
  totalTaskCount: number;
  searchQuery: string;
  filterAssignee: string;
  filterPriority: string;
  onSearchChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onAddTask: () => void;
  onClearFilters: () => void;
};

export const BoardToolbar = ({
  totalTaskCount,
  searchQuery,
  filterAssignee,
  filterPriority,
  onClearFilters,
  onSearchChange,
  onAssigneeChange,
  onPriorityChange,
  onAddTask,
}: Props) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
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
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ bgcolor: "white", borderRadius: 1 }}
      />

      <TextField
        select
        size="small"
        label="Assignee"
        value={filterAssignee}
        onChange={(e) => onAssigneeChange(e.target.value)}
        sx={{ minWidth: 160, bgcolor: "white", borderRadius: 1 }}
      >
        <MenuItem value="">All</MenuItem>
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
        onChange={(e) => onPriorityChange(e.target.value)}
        sx={{ minWidth: 140, bgcolor: "white", borderRadius: 1 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
        <MenuItem value="critical">Critical</MenuItem>
      </TextField>
      <Button variant="outlined" onClick={onClearFilters}>clear filters</Button>
      <Button variant="contained" onClick={onAddTask}>
        Add Task
      </Button>
    </Stack>
  );
};