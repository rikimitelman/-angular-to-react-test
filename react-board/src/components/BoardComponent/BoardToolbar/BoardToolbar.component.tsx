import { useState } from "react";
import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ASSIGNEES, PRIORITIES } from "../../../types/task.types";
import { getBoardToolbarStyles } from "./BoardToolbar.styles";

export type BoardFilters = {
  assignee: string;
  priority: string;
  searchQuery: string;
};

type Props = {
  totalTaskCount: number;
  onFiltersChange: (filters: BoardFilters) => void;
  onAddTask: () => void;
};

export const BoardToolbar = ({
  totalTaskCount,
  onFiltersChange,
  onAddTask,
}: Props) => {
  const [filters, setFilters] = useState<BoardFilters>({
    assignee: "",
    priority: "",
    searchQuery: "",
  });

  const updateFilters = (changes: Partial<BoardFilters>) => {
    const nextFilters = {
      ...filters,
      ...changes,
    };

    setFilters(nextFilters);
    onFiltersChange(nextFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      assignee: "",
      priority: "",
      searchQuery: "",
    };

    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

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
        value={filters.searchQuery}
        onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        sx={getBoardToolbarStyles.field}
      />

      <TextField
        select
        size="small"
        label="Assignee"
        value={filters.assignee}
        onChange={(e) => updateFilters({ assignee: e.target.value })}
        sx={getBoardToolbarStyles.assigneeField}
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
        value={filters.priority}
        onChange={(e) => updateFilters({ priority: e.target.value })}
        sx={getBoardToolbarStyles.priorityField}
      >
        <MenuItem value="">All</MenuItem>

        {PRIORITIES.map((priority) => (
          <MenuItem key={priority} value={priority}>
            {priority}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="outlined" onClick={clearFilters}>
        Clear filters
      </Button>

      <Button variant="contained" onClick={onAddTask}>
        Add Task
      </Button>
    </Stack>
  );
};