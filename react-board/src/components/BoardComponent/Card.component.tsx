import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Paper
} from '@mui/material';

import { useTasks } from '../../hooks/useTasks';

const columns = [
    'todo',
    'in-progress',
    'review',
    'done'
];

export const BoardGrid: React.FC = () => {
    const { tasks } = useTasks();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(300px, 1fr))',
                gap: 2,
                p: 2,
                bgcolor: '#0f172a',
                minHeight: '100vh',
            }}
        >
            {columns.map((column) => (
                <Paper
                    key={column}
                    sx={{
                        bgcolor: '#111827',
                        border: '1px solid #243044',
                        p: 1.5,
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#bfdbfe',
                            fontWeight: 700,
                            mb: 2,
                            textTransform: 'uppercase',
                        }}
                    >
                        {column}
                    </Typography>

                    {tasks
                        ?.filter(task => task.status === column)
                        .map(task => (
                            <Card
                                draggable
                                key={task.title}
                                sx={{
                                    bgcolor: '#1e293b',
                                    border: '1px solid #334155',
                                    color: 'white',
                                    mb: 1.25,
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ mb: 2 }}
                                    >
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            sx={{
                                                bgcolor: '#7f1d1d',
                                                color: 'white',
                                                fontWeight: 700,
                                            }}
                                        />

                                        <Chip
                                            label={task.description}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                borderColor: '#6366f1',
                                                color: '#818cf8',
                                            }}
                                        />
                                    </Stack>

                                    <Typography sx={{ fontWeight: 700 }}>
                                        {task.title}
                                    </Typography>
                                    <Box
                                        sx={{
                                            mt: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Chip
                                            label={task.assignee}
                                            size="small"
                                            sx={{
                                                bgcolor: '#0f172a',
                                                color: '#bfdbfe',
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                color: '#64748b',
                                                fontSize: 13,
                                            }}
                                        >
                                            {task.assignee}
                                        </Typography>
                                    </Box>

                                </CardContent>
                            </Card>
                        ))}
                </Paper>
            ))}
        </Box>
    );
};