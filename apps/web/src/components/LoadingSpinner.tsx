import { CircularProgress } from "@mui/material";

export const LoadingSpinner = () => {
    return (
        <div className="text-primary">
            <CircularProgress
                aria-label="Loading…"
                color="inherit"
                size={"15rem"}
            />
        </div>
    );
};
