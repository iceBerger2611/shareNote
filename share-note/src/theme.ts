import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#1d97fcff",
          border: "1px solid",
          borderRadius: "8px",
          padding: "0.6em 1.2em",
          fontWeight: 500,
          fontFamily: "inherit",
          backgroundColor: "#505050ff",
          transition: "border-color 0.25s",
          ":hover": {
            color: "#646cff",
          },
          ":focus": {
            outline: "4px auto -webkit-focus-ring-color",
          },
          ":focus-visible": {
            outline: "4px auto -webkit-focus-ring-color",
          },
        },
      },
    },
  },
});

export default theme;
