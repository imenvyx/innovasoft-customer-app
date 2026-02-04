import { Snackbar, Alert, AlertColor } from "@mui/material";

interface SnackbarMessageProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

const SnackbarMessage = ({
  open,
  message,
  severity,
  onClose,
}: SnackbarMessageProps) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMessage;
