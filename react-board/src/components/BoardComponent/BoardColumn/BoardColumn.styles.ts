export const boardColumnStyles = (borderColor: string) => ({
  root: {
    bgcolor: "#111827",
    border: "1px solid #243044",
    p: 2,
    borderRadius: 2,
    borderTop: `3px solid ${borderColor}`,
    minHeight: 240,
  },

  header: {
    mb: 2,
  },

  title: {
    color: "#bfdbfe",
    fontWeight: 700,
    textTransform: "uppercase",
  },

  countChip: {
    bgcolor: "#1e293b",
    color: "white",
  },
});