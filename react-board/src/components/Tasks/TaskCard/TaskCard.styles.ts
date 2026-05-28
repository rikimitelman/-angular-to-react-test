
export const getTaskCardStyles
 = (isDone: boolean) => ({
    root: {
    cursor: "grab",
    bgcolor: "#1e293b",
    border: "1px solid #334155",
    opacity: isDone ? 0.6 : 1,
    mb: 1.5,
    borderRadius: 2,
    transition: "0.2s",

    "&:active": {
      cursor: "grabbing",
    },

    "&:hover": {
      borderColor: "#64748b",
      transform: "translateY(-2px)",
    },

    "&:hover .task-actions": {
      opacity: 1,
      visibility: "visible",
    },
  },

  actions: {
    opacity: 0,
    visibility: "hidden",
    transition: "0.2s",
  },

    content: {
        p: 2,
        "&:last-child": { pb: 2 },
    },

    chipsRow: {
        mb: 2,
    },

    title: {
        fontWeight: 700,
        mb: 1,
        color: "white",
        textDecoration: "none",
        display: "block",
        "&:hover": {
            color: "#60a5fa",
            textDecoration: "underline",
        },
    },

    project: {
        color: "#94a3b8",
        mb: 1,
    },

    assigneeChip: {
        bgcolor: "#0f172a",
        color: "#bfdbfe",
    },

    tagChip: {
        borderColor: "#475569",
        color: "#cbd5e1",
    },

    metaRow: { mb: 1.5 },

    dueDate: (overdue: boolean) => ({
        color: overdue ? "#ef4444" : "#94a3b8",
        fontSize: 13,
    }),

});