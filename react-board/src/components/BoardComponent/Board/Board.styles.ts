export const boardStyles = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    p: 3,
    bgcolor: "#0f172a",
    minHeight: "100vh",
  },

  columnsGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "repeat(2, minmax(280px, 1fr))",
      xl: "repeat(4, minmax(280px, 1fr))",
    },
    gap: 2,
    alignItems: "start",
  },
};